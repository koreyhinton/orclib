;; WIK LANG MODE - VARS

;; Custom errors
(define-error 'wik-lang-mode-error "Wik Lang Mode General Error" 'error)
(define-error 'wik-lang-mode-expected-peek-error "Expected peek before complete" 'wik-lang-mode-error)
(define-error 'wik-lang-mode-nested-peek-error "Nested peeking is not supported" 'wik-lang-mode-error)

;; overrideable variables
(setq wik-lang-file-path-begin-regexp-old "[\" \n][{\\[]?"); spaces must be marked in region
(setq wik-lang-file-path-end-regexp-old "[.,;\\)}a-zA-Z0-9]?[\" \n]"); spaces must be marked in region

(setq wik-kbd-wik-lang-peek-discard "C-c <left>")
(setq wik-kbd-wik-lang-peek "C-c <right>")
(setq wik-kbd-wik-lang-complete "C-c c") ;; complete
(setq wik-kbd-wik-lang-open-file-at-point "C-c <down>") ;"M-S-<down>"
(setq wik-kbd-wik-lang-close-file "C-c <up>") ; "M-S-<up>"
(setq wik-kbd-wik-wik-lang-find-file "C-c f")

 (setq wik-lang-mode-map (make-sparse-keymap)) 
  (setq case-fold-search nil)
  (define-key wik-lang-mode-map (kbd wik-kbd-wik-lang-peek-discard) 'wik-lang-peek-discard)
  (define-key wik-lang-mode-map (kbd wik-kbd-wik-lang-peek) 'wik-lang-peek)
  (define-key wik-lang-mode-map (kbd wik-kbd-wik-lang-complete) 'wik-lang-complete)
  (define-key wik-lang-mode-map (kbd wik-kbd-wik-lang-open-file-at-point) 'wik-lang-open-file-at-point)
  (define-key wik-lang-mode-map (kbd wik-kbd-wik-lang-close-file) 'wik-lang-close-file)
  ;;(define-key wik-lang-mode-map [(tab)] 'wik-lang-indent)
  (define-key wik-lang-mode-map (kbd "TAB") 'wik-lang-indent)
  ;;(define-key wik-lang-mode-map [(return)] 'wik-lang-nl)
  (define-key wik-lang-mode-map (kbd "RET") 'wik-lang-nl)
  (define-key wik-lang-mode-map (kbd wik-kbd-wik-wik-lang-find-file) 'wik-lang-find-file)


;; WIK MODE - OUTLINE MODE DERIVATION
(define-derived-mode wik-lang-mode fundamental-mode "WIK-LANG"

  )

(add-to-list 'auto-mode-alist '("\\.wl\\'" . wik-lang-mode))
(add-to-list 'interpreter-mode-alist '("bash" . wik-lang-mode))

;; WIK MODE - FUNCTIONS
(defun wik-lang-indent ()
  (interactive)
  (insert "    ")
  )

(defun wik-lang-nl ()
  (interactive)
  (insert "\n")
  )

(defun wik-lang-find-file ()
  (interactive)
  (find-file (read-file-name "Find Wik: "))
  (wik-lang-mode)
  )

(defun wik-lang-wipe-out-line ()
    "Like kill-line without saving to clipboard"
    (delete-region (point)
        (if (eolp)
            (min (point-max) (1+ (point)))
            (line-end-position))))

;; LITERATE PROGRAMMING FEATURE - PEEK
(defun wik-lang-peek-discard ()
  (interactive)
  (save-excursion
      (end-of-line)
      (unless
          (re-search-backward "<<<<<<< PATH PEEKED" nil t) ; noerror=t
          (signal 'wik-lang-mode-expected-peek-error nil)))
  (end-of-line)
  (re-search-backward "<<<<<<< PATH PEEKED")
  (wik-lang-wipe-out-line)
  (wik-lang-wipe-out-line)
  (end-of-line) ;; =======
  (wik-lang-wipe-out-line)
  (wik-lang-wipe-out-line)
  (wik-lang-wipe-out-line)
  (set-mark (point))
  (re-search-forward ">>>>>>> PEEK")
  (delete-region (mark) (point))
  )

;; There is a known abnormality when a path is not on its own line
;; hello /my/path 1.txt world
;;        ^__________^ (region selection)
;; the conflict markers will appear but cannot go on their own line as they should
;; and it will not be a proper wik heading (and manual emacs command navigation will be
;; required to fix it.
(defun wik-lang-peek ()
  (interactive)
  (let ((file-name (wik-lang-file-at-point)))
    (save-excursion
        (if
            (re-search-backward "<<<<<<< PATH PEEKED" nil t) ; noerror=t
            (signal 'wik-lang-mode-nested-peek-error nil)))
    (if (file-exists-p file-name)
        (progn
            (insert (concat "<<<<<<< PATH PEEKED" "\n"))
            (forward-char (length file-name))
            (insert (concat "\n" "=======" "\n"))
            (if (file-directory-p file-name)
                (insert
                    (mapconcat (lambda (f) (concat "./" f))
                        (directory-files
                            file-name
                            nil
                            directory-files-no-dot-files-regexp
                        )
                        "\n"
                    )
                )
                (let ((inserted-region (insert-file-contents file-name)))
                    ;; you might think insert-file-contents would go to the end of the content,
                    ;; well it doesn't and the cursor stays just before the first content char
                    (forward-char (cadr inserted-region))
                )
            )
            (unless (eq (char-before) ?\n)
              (insert "\n"))
            (insert ">>>>>>> PEEK")
            (message "peek opened"))
        (message "Error: File does not exist: %s" file-name)
    )
  )
)

(defun wik-lang-complete ()
    (interactive)
    (save-excursion
        (unless
            (re-search-backward "<<<<<<< PATH PEEKED" nil t) ; noerror=t
            (signal 'wik-lang-mode-expected-peek-error nil)))
    (let ((file-name-last-comp (wik-lang-file-at-point)))
        (wik-lang-peek-discard)
        (unless (eq (char-before) ?/)
            (insert "/"))
        (insert (substring file-name-last-comp 2)) ;; todo: add 'is a directory peek' guard to top of function (Issue #3) since a directory peek is guaranteed to have ./ path marker in front of each sub-item
    )
)

(defun wik-lang-open-file-at-point ()
  (interactive)

  (let ((file-name (wik-lang-file-at-point)))

    (if (string-match-p "^\\./" file-name)
        ;; remove preceding ./ to make fallback folder ref substitution easier
        (setq file-name (substring file-name 2 nil))
    )
    (if (not (file-exists-p file-name))
        ;; fallback folder reference substitution
        (setq
            file-name
            (concat
                (with-temp-buffer
                    (insert-file-contents (nth 0 (split-string file-name "/")))
                    (buffer-substring-no-properties
                        (point-min)
                        (- (point-max) 1) ;; emacs (default) saves w/ newline
                    )
                )
                (substring
                    file-name
                    (length (nth 0 (split-string file-name "/")))
                    nil
                )
            )
        )
    )

    (find-file-other-window file-name)

    (wik-lang-mode)
  ))

(defun wik-lang-file-at-point ()
  (let ((left-pt (point)) (right-pt (point)) (begin-pt -99) (end-pt -99)
	(file-name ".untitled"))
    (if (use-region-p)
	(progn
	  (setq left-pt (region-beginning))
	  (setq right-pt (region-end))
	  )
      )
    (goto-char right-pt)
    (re-search-forward wik-lang-mode-elreg-file-path-end-regexp)
    (if (eq (char-before) 32) ; space
        (backward-char))

    (if (char-equal (char-after (- (point) 1)) 46)
	(backward-char)
      )
    (if (char-equal (char-after (- (point) 1)) 34)
	(backward-char)
	)
    (setq end-pt (point))
    (goto-char left-pt)
    (re-search-backward wik-lang-mode-elreg-file-path-begin-regexp)
    (if (eq (char-after) 32) ; space
        (forward-char))
    (setq begin-pt (point)) ;
    (setq file-name (buffer-substring begin-pt end-pt))
    file-name
  ))
  
  

(defun wik-lang-close-file ()
  (interactive)
  (kill-this-buffer)
  (if (cdr (window-list))
      (delete-window)
    )
  )
