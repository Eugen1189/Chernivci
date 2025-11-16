from pathlib import Path

html_path = Path("index.html")
text = html_path.read_text(encoding="utf-8")

style_start = text.find("<style>")
style_end = text.find("</style>", style_start)
if style_start != -1 and style_end != -1:
    style_end += len("</style>")
    text = text[:style_start] + text[style_end:]

script_start = text.rfind("<script>")
script_end = text.rfind("</script>")
if script_start != -1 and script_end != -1:
    script_block = text[script_start + len("<script>"):script_end].strip()
    Path("main.js").write_text(script_block + "\n", encoding="utf-8")
    text = (
        text[:script_start]
        + '    <script src="main.js"></script>\n'
        + text[script_end + len("</script>"):]
    )

html_path.write_text(text, encoding="utf-8")

