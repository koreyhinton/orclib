# WIK LANG METAPROGRAMMING

The [src/wik-lang-mode.el](src/wik-lang-mode.el) file is provided in this repo as a major mode in emacs that enables easy navigation between .wl wik-lang meta programming files. Wik mode simply uses real pathing in plain text to detect the file references but you must use any of these leading path markers at the start of filenames: './', '/', '~/'. Mostly you'd use the relative current directory path marker './' to reference sibling './sibling.wl' or subfolder './subfolder/file.wl' files.

These .wl files are templates that generate general-purpose programming language code using bash heredocs.

Wik lang mode enables the following features when the cursor is located on a path reference (for paths with spaces, select the entire path as a region first):

- file peek: ctrl-c <right-arrow>
- close file peek (with cursor placed anywhere in the conflict marker syntax that opens for you): ctrl-c <right-arrow>
- open file: ctrl-c <down-arrow>
- close file: ctrl-c <up-arrow>

## Types of wik (meta-)lang files

### static templates

A static template is an ascii text (non-script) file that has code in it that contains no generated code variables within it, so it's a verbatim printed out version of what will go into the output program.

sql.wl:

```sh

"SELECT id, name FROM people WHERE age > ?"

```

### mapper templates

A mapper template is a subscript template that can map variables to a new variable namespace required by other subscripts using 2 namespace prefix arguments. It contains only variable re-assignment statements.

arg-map.wl

```sh
v1=${1}
v2=${2}
cat << EOF
    String[] ${v1}Args = ${v2}args;
EOF
```

### subscript templates

A regular (non-mapper) subscript template, like the mapper version, also exists in a hierarchy that has a main template as its root ancestor and uses bash heredoc syntax, but just like the main template it uses a single parameter provided with the variable namespace prefix as its argument, and doesn't default to a value of its own (the parent is in charge of knowing the data prefixing the subscript operates on).

arg-print.wl

```sh
v=${1}
cat << EOF
    for (String ${v}Arg : ${v}Args) {
        System.out.println(${v}Prefix + ${v}Arg);
    }
EOF
```

### main script template

A main script template generates an entry point of an application or api controller endpoint and typically when invoked won't be passed in a namespace prefix parameter, so it uses a default variable namespace parameter fallback.

App.wl snippet:

```sh
v=${1:-main_}
# maps
${v}print_Args=args
${v}gtk_Args=args

cat << EOF
    // ...
    public class Example {
        // ...
        public static void main(String[] args) {
            ` ./arg-print.wl ${v}print_ `
            // ...
            try (PreparedStatement ${v}stmt =
                    ${v}con.prepareStatement(` cat ./sql.wl `)) {
                // ...
            }
            // ...
        }
    }
EOF

```
