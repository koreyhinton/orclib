#!/bin/bash

v=${1}
cat << EOF
            const string ${v}BlockTagsA = "ins|del";
            const string ${v}lockTagsB = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|address|script|noscript|form|fieldset|iframe|math";

            // Regular expression for the content of a block tag.
            const string ${v}Attr = @"
            (?>				            # optional tag attributes
              \s			            # starts with whitespace
              (?>
                [^>""/]+	            # text outside quotes
              |
                /+(?!>)		            # slash not followed by >
              |
                ""[^""]*""		        # text inside double quotes (tolerate >)
              |
                '[^']*'	                # text inside single quotes (tolerate >)
              )*
            )?	
            ";

            var ${v}repeat_open_Text = @"
                (?>
                  [^<]+			        # content without tag
                |
                  <\2			        # nested opening tag
                    " + attr + @"       # attributes
                  (?>
                      />
                  |
                      >";
            var ${v}repeat_open_NestDepth = ${v}NestDepth;
            `./block_pattern_repeat.wl ${v}repeat_open_ `

            var ${v}repeat_close_Text = @"
                      </\2\s*>	        # closing nested tag
                  )
                  |				
                  <(?!/\2\s*>           # other tags with a different name
                  )
                )*";

            var ${v}repeat_close_NestDepth = ${v}NestDepth;
            `./block_pattern_repeat.wl ${v}repeat_close_ `

            var ${v}Content = (
                    ${v}repeat_open_RepeatedText + ".*?" + ${v}repeat_close_RepeatedText
                );
            var ${v}Content2 = ${v}Content.Replace(@"\2", @"\3");

            // First, look for nested blocks, e.g.:
            // 	<div>
            // 		<div>
            // 		tags for inner block must be indented.
            // 		</div>
            // 	</div>
            //
            // The outermost tags must start at the left margin for this to match, and
            // the inner nested divs must be indented.
            // We need to do this before the next, more liberal match, because the next
            // match will start at the first '<div>' and stop at the first '</div>'.
            string ${v}Pattern = @"
            (?>
                  (?>
                    (?<=\n)     # Starting at the beginning of a line
                    |           # or
                    \A\n?       # the beginning of the doc
                  )
                  (             # save in \$1

                    # Match from '\n<tag>' to '</tag>\n', handling nested tags 
                    # in between.
                      
                        <(\$block_tags_b_re)   # start tag = \$2
                        \$attr>                # attributes followed by > and \n
                        \$content              # content, support nesting
                        </\2>                 # the matching end tag
                        [ ]*                  # trailing spaces
                        (?=\n+|\Z)            # followed by a newline or end of document

                  | # Special version for tags of group a.

                        <(\$block_tags_a_re)   # start tag = \$3
                        \$attr>[ ]*\n          # attributes followed by >
                        \$content2             # content, support nesting
                        </\3>                 # the matching end tag
                        [ ]*                  # trailing spaces
                        (?=\n+|\Z)            # followed by a newline or end of document
                      
                  | # Special case just for <hr />. It was easier to make a special 
                    # case than to make the other regex more complicated.
                  
                        [ ]{0,\$less_than_tab}
                        <hr
                        \$attr                 # attributes
                        /?>                   # the matching end tag
                        [ ]*
                        (?=\n{2,}|\Z)         # followed by a blank line or end of document
                  
                  | # Special case for standalone HTML comments:
                  
                      (?<=\n\n|\A)            # preceded by a blank line or start of document
                      [ ]{0,\$less_than_tab}
                      (?s:
                        <!--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)-->
                      )
                      [ ]*
                      (?=\n{2,}|\Z)            # followed by a blank line or end of document
                  
                  | # PHP and ASP-style processor instructions (<? and <%)
                  
                      [ ]{0,\$less_than_tab}
                      (?s:
                        <([?%])                # \$4
                        .*?
                        \4>
                      )
                      [ ]*
                      (?=\n{2,}|\Z)            # followed by a blank line or end of document
                      
                  )
            )";

            ${v}Pattern = ${v}Pattern.Replace("\$less_than_tab", (${v}TabWidth - 1).ToString());
            ${v}Pattern = ${v}Pattern.Replace("\$block_tags_b_re", ${v}BlockTagsB);
            ${v}Pattern = ${v}Pattern.Replace("\$block_tags_a_re", ${v}BlockTagsA);
            ${v}Pattern = ${v}Pattern.Replace("\$attr", ${v}Attr);
            ${v}Pattern = ${v}Pattern.Replace("\$content2", ${v}Content2);
            ${v}Pattern = pattern.Replace("\$content", ${v}Content);
EOF
