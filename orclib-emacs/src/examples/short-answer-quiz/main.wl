#!/bin/bash

v=${1:-quiz_}
cat << EOF

    using Json;
    using Gtk;

    int main(string[] args) {

        /*
            Load quiz JSON file
        */
        string? ${v}json_QuizAnswerType;
        string? ${v}json_QuizName;
        Json.Array ${v}json_QAs;
        try
        {
            string? ${v}json_FilePath;
            if (args.length < 2)
            {
                stdout.printf("quiz json filepath: ");
                ${v}json_FilePath = stdin.read_line();
            }
            else
            {
                ${v}json_FilePath = args[1];
            }
            ` ./load-json.wl ${v}json_ `
        }
        catch(Error e)
        {
            stderr.printf("Error: %s\n", e.message);
            return 1;
        }

        if (0 == ${v}json_QAs.get_length())
        {
            stderr.printf("Error: No questions found in this quiz\n");
            return 2;
        }

        /*
            GTK objects
        */
        Gtk.init(ref args);

        var ${v}NextIcon = new Gtk.Image.from_icon_name("go-next", IconSize.SMALL_TOOLBAR);
        var ${v}NextButton = new Gtk.ToolButton(${v}NextIcon, "Dir");

        var ${v}Toolbar = new Toolbar();
        ${v}Toolbar.add(${v}NextButton);

        var ${v}qa_TitleLabel = new Gtk.Label("<b>?</b>");
        ${v}qa_TitleLabel.set_use_markup(true);

        var ${v}qa_TextView = new TextView();
        ${v}qa_TextView.editable = true;
        ${v}qa_TextView.cursor_visible = false;

        var ${v}Vbox = new Box(Orientation.VERTICAL, 0);
        ${v}Vbox.pack_start(${v}Toolbar, false, true, 0);
        ${v}Vbox.pack_start(${v}qa_TitleLabel, false, true, 0);
        ${v}Vbox.pack_start(${v}qa_TextView, true, true, 0);

        /*
            Quiz handling
        */
        var ${v}Count = ${v}json_QAs.get_length();
        var ${v}qa_QAs = ${v}json_QAs;
        uint ${v}qa_I = 0;
        ` ./load-qa.wl ${v}qa_ `
        ${v}NextButton.clicked.connect(() => {

            if (${v}json_QuizAnswerType == "int")
            {
                var ${v}score_int_Ans = ${v}qa_QAs.get_element(${v}qa_I).get_object().get_int_member("A");
                int ${v}score_int_UsrAns;
                if (int.try_parse(${v}qa_TextView.buffer.text.strip(), out ${v}score_int_UsrAns))
                {
                    ` ./score.wl ${v}score_int_ `
                }
                else
                {
                    stdout.printf("Incorrect\n");
                }
            }
            else
            {
                var ${v}score_str_Ans = ${v}qa_QAs.get_element(${v}qa_I).get_object().get_string_member("A");
                var ${v}score_str_UsrAns = ${v}qa_TextView.buffer.text;
                ` ./score.wl ${v}score_str_ `
            }

            ${v}qa_I = (${v}qa_I + 1) % ${v}Count;

            ` ./load-qa.wl ${v}qa_ `
	});

        /*
            Launch GTK window (and connect destroy signal)
        */
        var ${v}Window = new Window();
        ${v}Window.add(${v}Vbox);
        ${v}Window.title = ${v}json_QuizName;
        ${v}Window.border_width = 10;
        ${v}Window.window_position = WindowPosition.CENTER;
        ${v}Window.set_default_size(666, 444);
        ${v}Window.destroy.connect(() => {
            Gtk.main_quit();
        });
        ${v}Window.show_all();
        Gtk.main();

        return 0;
    }

EOF
