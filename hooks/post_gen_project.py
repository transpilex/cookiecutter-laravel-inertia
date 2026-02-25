import json
import shutil
from pathlib import Path

TERMINATOR = "\x1b[0m"
WARNING = "\033[38;5;178m"
INFO = "\033[38;5;39m "
HINT = "\x1b[3;33m"
SUCCESS = "\033[38;5;35m"


def configure_framework_files(framework):
    react_files = ["tsconfig-react.json", "resources/js/app.tsx", "resources/js/ssr.tsx", "resources/views/app-react.blade.php"]
    vue_files = ["tsconfig-vue.json", "resources/js/app.ts", "resources/js/ssr.ts", "resources/views/app-vue.blade.php"]

    if framework == "React":
        for file in vue_files:
            p = Path(file)
            if p.exists():
                p.unlink()

        for file in react_files:
            p = Path(file)
            if p.exists():
                new_name = p.with_name(p.name.replace("-react", ""))
                p.rename(new_name)

    elif framework == "Vue":
        for file in react_files:
            p = Path(file)
            if p.exists():
                p.unlink()

        for file in vue_files:
            p = Path(file)
            if p.exists():
                new_name = p.with_name(p.name.replace("-vue", ""))
                p.rename(new_name)


def update_package_json(remove_dev_deps=None, remove_deps=None, remove_keys=None, scripts=None):
    remove_dev_deps = remove_dev_deps or []
    remove_deps = remove_deps or []
    remove_keys = remove_keys or []
    scripts = scripts or {}
    package_json = Path("package.json")
    content = json.loads(package_json.read_text())
    for package_name in remove_dev_deps:
        content["devDependencies"].pop(package_name)

    for package_name in remove_deps:
        content["dependencies"].pop(package_name)

    for key in remove_keys:
        content.pop(key)
    content["scripts"].update(scripts)
    updated_content = json.dumps(content, ensure_ascii=False, indent=2) + "\n"
    package_json.write_text(updated_content)


def handle_js_runner(framework, ui_library):
    if framework == "React":
        remove_dev_deps = ["@vitejs/plugin-vue", "vue-tsc"]
        remove_deps = ["@inertiajs/vue3", "vue"]
        if ui_library == "Tailwind":
            remove_dev_deps.extend([])
        elif ui_library == "Bootstrap":
            remove_dev_deps.extend(["@tailwindcss/vite", "tailwindcss"])

        # update_package_json(remove_dev_deps=remove_dev_deps, remove_deps=remove_deps)

    elif framework == "Vue":
        remove_dev_deps = ["@types/react",  "@types/react-dom", "@vitejs/plugin-react", "babel-plugin-react-compiler"]
        remove_deps = ["@inertiajs/react", "react", "react-dom"]
        if ui_library == "Tailwind":
            remove_dev_deps.extend([])
        elif ui_library == "Bootstrap":
            remove_dev_deps.extend(["@tailwindcss/vite", "tailwindcss"])

        # update_package_json(remove_dev_deps=remove_dev_deps, remove_deps=remove_deps)


def main():
    if "{{ cookiecutter.framework }}" != "None":
        configure_framework_files("{{ cookiecutter.framework }}")

    # if "{{ cookiecutter.framework }}" != "None":
        # handle_js_runner("{{ cookiecutter.framework }}", "{{ cookiecutter.ui_library }}")

    print(SUCCESS + "Project initialized, keep up the good work!" + TERMINATOR)


if __name__ == "__main__":
    main()
