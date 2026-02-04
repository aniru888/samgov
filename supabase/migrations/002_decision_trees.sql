-- SamGov Decision Trees Schema
-- Stores eligibility debugger decision trees for each scheme

CREATE TABLE decision_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT false,
  tree JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure only one active tree per scheme
  CONSTRAINT unique_active_tree_per_scheme
    EXCLUDE USING btree (scheme_id WITH =)
    WHERE (is_active = true)
);

-- Index for scheme lookups
CREATE INDEX idx_decision_trees_scheme_id ON decision_trees(scheme_id);
CREATE INDEX idx_decision_trees_active ON decision_trees(scheme_id, is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE decision_trees ENABLE ROW LEVEL SECURITY;

-- Public can read active decision trees
CREATE POLICY "Active decision trees are publicly readable"
  ON decision_trees
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Authenticated users can read all trees (for admin)
CREATE POLICY "Authenticated users can read all trees"
  ON decision_trees
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can manage trees
CREATE POLICY "Authenticated users can insert trees"
  ON decision_trees
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update trees"
  ON decision_trees
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE TRIGGER update_decision_trees_updated_at
  BEFORE UPDATE ON decision_trees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Helper function to deactivate other trees when activating one
CREATE OR REPLACE FUNCTION deactivate_other_trees()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE decision_trees
    SET is_active = false, updated_at = NOW()
    WHERE scheme_id = NEW.scheme_id
      AND id != NEW.id
      AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deactivate_other_trees_trigger
  BEFORE INSERT OR UPDATE ON decision_trees
  FOR EACH ROW
  EXECUTE FUNCTION deactivate_other_trees();

-- Comment explaining the JSONB tree structure
COMMENT ON COLUMN decision_trees.tree IS 'JSONB decision tree structure.
Root key "start" points to first node. Each node has:
- type: "question" | "result"
- For questions: text_en, text_kn (optional), options: [{label, next}]
- For results: status: "eligible"|"ineligible"|"needs_review", reason_en, reason_kn, fix_en, documents[]
All "next" references must point to existing node keys.';
