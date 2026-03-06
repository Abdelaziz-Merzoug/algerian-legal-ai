'use client';

import Modal from './Modal';
import Button from './Button';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    variant = 'danger',
    isLoading = false,
}: ConfirmModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || t.admin.confirmDelete}
            maxWidth="sm"
        >
            <div className="space-y-5">
                <p className="text-text-light">
                    {message || t.admin.confirmDeleteMessage}
                </p>
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText || t.common.cancel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText || t.common.confirm}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
