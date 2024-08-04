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

(def samples '(
        (0.000000f32 (77.155090f32 -56.166470f32 -71.169586f32 118.287262f32 0.719051f32 28.381599f32))
        (1.000000f32 (70.162331f32 -51.088139f32 -82.109940f32 115.398422f32 -2.774332f32 25.098354f32))
        (2.000000f32 (60.470413f32 -45.750153f32 -89.710068f32 114.826393f32 0.638305f32 23.260305f32))
        (3.000000f32 (50.652008f32 -33.032402f32 -99.278282f32 112.575905f32 0.380947f32 19.694031f32))
        (4.000000f32 (42.833641f32 -21.634390f32 -107.775520f32 107.605133f32 0.872957f32 15.556467f32))
        (5.000000f32 (35.281643f32 -7.994194f32 -114.832512f32 110.728424f32 1.665567f32 13.141257f32))
        (6.000000f32 (28.851322f32 9.975958f32 -122.654716f32 107.023102f32 2.014742f32 9.854485f32))
        (7.000000f32 (23.047459f32 24.169014f32 -130.783798f32 105.162590f32 3.945687f32 5.754052f32))
        (8.000000f32 (22.150394f32 52.580570f32 -139.986542f32 103.138458f32 9.137066f32 3.010692f32))
        (9.000000f32 (27.178110f32 68.763519f32 -147.078812f32 101.759140f32 11.761799f32 -4.961079f32))
        (10.000000f32 (36.954716f32 85.505180f32 -149.959274f32 100.783073f32 19.393232f32 -10.432604f32))
        (11.000000f32 (45.065605f32 88.900658f32 -153.089615f32 101.651352f32 27.115824f32 -18.856934f32))
        (12.000000f32 (53.612511f32 83.455170f32 -153.668137f32 101.428062f32 37.330002f32 -27.502510f32))
        (13.000000f32 (57.177311f32 63.151409f32 -152.426895f32 101.609787f32 51.037949f32 -40.468166f32))
        (13.500000f32 (54.639412f32 43.179363f32 -153.932846f32 100.751709f32 59.314964f32 -58.384121f32))
))

(defun literal-examples () {
    (list
        (list \#a \#X)
        (list 1b 255b)
        (list 1 -5)
        (list 1u 5u)
        (list 1i32 -5i32)
        (list 1u32 0xFF)
        (list 1i64 -5i64)
        (list 1u64 0xFFu64)
        (list 3.14 -6.28)
        (list 3.14f32 -6.28f32)
        (list 3.14f64 -6.28f64)
        (list (list 1 2 3))
        (list monkey define)
        (list "Hello world")
    )
})

(cond
    (test 1 2)
    (= 2 3)
    value
)