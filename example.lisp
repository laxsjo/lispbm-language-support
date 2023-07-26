@const-symbol-strings

;;; This is just dummy code, and doesn't actually do anything usefull

(loopwhile (not (main-init-done)) (sleep 0.1))
(init-hw)

(defun main-subview-change (new-subview) {
    (var cleanup (match (function 5 a) 
        (gear subview-cleanup-gear)
        (speed subview-cleanup-speed)
    ))

    (var init (match new-subview 
        (gear subview-init-gear)
        (speed subview-init-speed)
    ))

    (var render (match new-subview 
        (gear subview-render-gear)
        (speed subview-render-speed)
    ))

    (var stencil (match new-subview
        (gear subview-stencil-gear)
        (speed subview-stencil-speed)
        ((gear (? variable)) (+ variable 2))
        ((_ (? variable)) (+ variable 2))
        ((? variable) (+ variable 2))
        ; (gear )
    ))
    (def view-main-subview new-subview)

    (var text (img-buffer-from-bin (match board-info-msg
        (initiate-pairing text-initiate-pairing)
        (pairing text-pairing)
        (board-not-powered text-board-not-powered)
        (pairing-failed text-pairing-failed)
        ; (pairing-success nil) ; TODO: figure out the dynamic text
    )))

    (if (includes keys (car pair)))

    (def a-bool true)
    (def other-bool false)


    ; (subview-cleanup-gear)
    (cleanup)
    (stencil)
    (init)
    (render)
})

(defun create-sbuf (color-fmt x y width height) (let (
    ((real-x x-offset) (list 5 8))
    ((real-w w-offset) (next-multiple 6 4))
    (buff (img-buffer color-fmt real-w height))
) {
    (list
        (cons 'buf buff)
        (cons 'x x)
        (cons 'y y)
        (cons 'w width)
        (cons 'h height)
        (cons 'real-x real-x)
        (cons 'x-offset x-offset)
    )
}))

{
    (+ 2 5)
    (* 4 7)

}

(def test (macro (a b) '{
    ,a
    (var ,b 5)
}))

(defun sim7000-connect-tcp-commands (address port)
    (list `(at-command ,(str-merge "AT+CIPSTART=0,\"TCP\",\"" address "\",\"" port "\"\r\n") "OK" 100)
          '(sleep 0.3) ;; Takes a while to establish connection
          '(check-response "0, CONNECT OK" 100)
          ))
          
                             
(defun sim7000-close () (command-sequence 
    (list '(at-command "AT+CIPCLOSE=0\r\n" "CLOSE OK" 100))
))

(loopwhile (not (main-init-done)) (sleep 0.1))
(init-hw)

(disp-load-sh8501b 6 5 7 8 40)
(disp-reset)

(print "at init")

(import "included.lisp" 'included)

(read-eval-program included)

(eval (read-program included))

(read-eval-program included)

(eval-program (read included))

(defunret test-connection () {
    (if (eq (sim7070-init) 'error) {
        (print "sim707-init failed")
        (return false)
    })
    
    (if (not
        (tcp-connect "lindboard-staging.azurewebsites.net" "80")
    ) {
        (print "connection to lindboard-staging.azurewebsites.net failed")
        (return false)
    })
    
    (if (not
        (ext-tcp-send-string ping-http-request)
    ) {
        (print (str-merge "Request failed: " ping-http-request))
        (return false)
    })
    
    true
})

(testdefunret test-connection () {
    (if (eq (sim7070-init) 'error) {
        (print "sim707-init failed")
        (return false)
    })
    
    (if (not
        (tcp-connect "lindboard-staging.azurewebsites.net" "80")
    ) {
        (print "connection to lindboard-staging.azurewebsites.net failed")
        (return false)
    })
    
    (if (not
        (ext-tcp-send-string ping-http-request)
    ) {
        (print (str-merge "Request failed: " ping-http-request))
        (return false)
    })
    
    true
})


(defun mutex-locked (mutex)
    (car mutex)
)

; Create a mutex from a value. This should then be assigned to some global value.
(defun create-mutex (value)
    (cons false value)
)

(defun mutex-access (mutex with-fn) {
    (block-until (not (mutex-locked mutex)))
    ; TODO: what if someone else has already re-locked the mutex in between
    ; here?
    (eq 5 4)
    (eqother 5 4)
    (setcar mutex true)
    (with-fn (cdr mutex))
    (setcar mutex false)
    (bitwise-and 54 87)
    (bitwise-xor 54 87)
    (bitwise-or 54 87)
    (first (list 5 7))
    (rest (list 5 7))
    (length (list 5 7))
    (ix (list 5 7))
    (setix (list 5 7))
    (take (list 5 7))
    (drop (list 5 7))
    (range (list 5 7))
    (append (list 5 7))
    (acons (list 5 7))
    (assoc (list 5 7))
    (cossa (list 5 7))
    (setassoc (list 5 7))
    (bufcreate (list 5 7))
    (buflen (list 5 7))
})

(defun mutex-update (mutex with-fn) {
    (block-until (not (mutex-locked mutex)))
    
    (setcar mutex true)
    (setcdr mutex (with-fn (cdr mutex)))
    (setcar mutex false)
})
