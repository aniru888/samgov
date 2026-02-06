import { createClient } from "@/lib/supabase/server";
import { Scheme } from "@/types/scheme";
import { SchemeListClient } from "@/components/scheme";

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Karnataka Welfare Schemes | SamGov",
  description:
    "Browse Karnataka government welfare schemes and check your eligibility. Includes Gruha Lakshmi, Shakti, Anna Bhagya and more.",
};

async function getSchemes(): Promise<Scheme[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schemes")
    .select("*")
    .order("name_en");

  if (error) {
    console.error("Error fetching schemes:", error);
    return [];
  }

  return data || [];
}

export default async function SchemesPage() {
  const schemes = await getSchemes();

  return <SchemeListClient schemes={schemes} />;
}
