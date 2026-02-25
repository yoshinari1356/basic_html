#!/usr/bin/env python3
"""
Inject PR preview banner into HTML files for GitHub Pages preview.

Usage:
    python3 pr-banner-inject.py <pr_num> <output_dir> <base_url>

Example:
    PR_NUM="15"
    PAGES_BASE="https://yoshinari1356.github.io/basic_html/pr-${PR_NUM}"
    python3 pr-banner-inject.py "${PR_NUM}" .preview_out "${PAGES_BASE}"

What this does:
  1. Adds  data-pr="<pr_num>"  to every <body> tag in .html files
  2. Adds  <link rel="stylesheet" href="<base_url>/pr-banner.css">  before </head>
"""
import sys
import os
import re


def inject(pr_num: str, output_dir: str, base_url: str) -> None:
    css_href = f"{base_url}/pr-banner.css"

    for root, dirs, files in os.walk(output_dir):
        # skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for fname in files:
            if not fname.endswith(".html"):
                continue
            path = os.path.join(root, fname)
            try:
                with open(path, encoding="utf-8", errors="ignore") as f:
                    original = f.read()

                # 1. Add data-pr attribute to <body ...>
                patched = re.sub(
                    r"<body([^>]*)>",
                    lambda m: f'<body{m.group(1)} data-pr="{pr_num}">',
                    original,
                    flags=re.IGNORECASE,
                )

                # 2. Insert CSS link just before </head>
                patched = re.sub(
                    r"(</head>)",
                    f'<link rel="stylesheet" href="{css_href}">\\1',
                    patched,
                    flags=re.IGNORECASE,
                )

                if patched != original:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(patched)
                    print(f"Patched: {path}")
                else:
                    print(f"Skipped (no <body> or </head> found): {path}")

            except Exception as e:
                print(f"Warning: could not patch {path}: {e}", file=sys.stderr)


def main() -> None:
    if len(sys.argv) != 4:
        print(
            "Usage: python3 pr-banner-inject.py <pr_num> <output_dir> <base_url>",
            file=sys.stderr,
        )
        sys.exit(1)
    inject(sys.argv[1], sys.argv[2], sys.argv[3])


if __name__ == "__main__":
    main()
