(loopwhile (not (main-init-done)) (sleep 0.1))
(init-hw)

(defun main-subview-change (new-subview) {
    (var cleanup (match view-main-subview 
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
    ))
    (def view-main-subview new-subview)

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