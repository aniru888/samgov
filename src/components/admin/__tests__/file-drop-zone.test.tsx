import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileDropZone } from "../file-drop-zone";

describe("FileDropZone", () => {
  it("renders empty drop zone", () => {
    render(
      <FileDropZone
        file={null}
        onFileSelect={vi.fn()}
        onFileClear={vi.fn()}
      />
    );

    expect(screen.getByText("Click or drag PDF here")).toBeInTheDocument();
    expect(screen.getByText(/PDF only, max/)).toBeInTheDocument();
  });

  it("renders file info when file is selected", () => {
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 1024 * 512 }); // 512 KB

    render(
      <FileDropZone
        file={file}
        onFileSelect={vi.fn()}
        onFileClear={vi.fn()}
      />
    );

    expect(screen.getByText("test.pdf")).toBeInTheDocument();
    expect(screen.getByText("512.0 KB")).toBeInTheDocument();
  });

  it("calls onFileClear when remove button is clicked", () => {
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const onFileClear = vi.fn();

    render(
      <FileDropZone
        file={file}
        onFileSelect={vi.fn()}
        onFileClear={onFileClear}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /remove file/i }));
    expect(onFileClear).toHaveBeenCalledOnce();
  });

  it("rejects non-PDF files", () => {
    const onFileSelect = vi.fn();

    render(
      <FileDropZone
        file={null}
        onFileSelect={onFileSelect}
        onFileClear={vi.fn()}
      />
    );

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const badFile = new File(["test"], "test.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [badFile] } });

    expect(onFileSelect).not.toHaveBeenCalled();
    expect(screen.getByText("Only PDF files are accepted.")).toBeInTheDocument();
  });

  it("rejects files exceeding max size", () => {
    const onFileSelect = vi.fn();

    render(
      <FileDropZone
        file={null}
        onFileSelect={onFileSelect}
        onFileClear={vi.fn()}
        maxSizeBytes={1024}
      />
    );

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const bigFile = new File(["x".repeat(2048)], "big.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(bigFile, "size", { value: 2048 });
    fireEvent.change(input, { target: { files: [bigFile] } });

    expect(onFileSelect).not.toHaveBeenCalled();
    expect(screen.getByText(/File too large/)).toBeInTheDocument();
  });

  it("accepts valid PDF file via input", () => {
    const onFileSelect = vi.fn();

    render(
      <FileDropZone
        file={null}
        onFileSelect={onFileSelect}
        onFileClear={vi.fn()}
      />
    );

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const pdfFile = new File(["test"], "doc.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(input, { target: { files: [pdfFile] } });

    expect(onFileSelect).toHaveBeenCalledWith(pdfFile);
  });

  it("shows external error prop", () => {
    render(
      <FileDropZone
        file={null}
        onFileSelect={vi.fn()}
        onFileClear={vi.fn()}
        error="Server rejected this file"
      />
    );

    expect(
      screen.getByText("Server rejected this file")
    ).toBeInTheDocument();
  });

  it("has accessible drop zone", () => {
    render(
      <FileDropZone
        file={null}
        onFileSelect={vi.fn()}
        onFileClear={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /upload pdf/i })
    ).toBeInTheDocument();
  });
});
