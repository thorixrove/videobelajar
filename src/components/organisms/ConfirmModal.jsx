import Button from "../atoms/Button.jsx";

export default function ConfirmModal({ open, title, message, confirmLabel = "Ya", cancelLabel = "Tidak", onConfirm, onCancel }) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm rounded-lg bg-white p-5 md:p-6"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="confirm-title" className="font-heading text-lg font-semibold">
                    {title}
                </h2>
                <p id="confirm-message" className="mt-2 text-sm text-muted">
                    {message}
                </p>

                <div className="mt-5 flex gap-3">
                    <Button type="button" variant="outline" block onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                    <Button type="button" variant="primary" block onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    )
}