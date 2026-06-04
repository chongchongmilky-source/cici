import Modal from './Modal.jsx';
import { Btn } from './index.jsx';

export default function ConfirmDialog({ title, message, danger = false, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} width="400px">
      <div style={{ marginBottom: 20, color: 'var(--text2)' }}>{message}</div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onCancel}>Huỷ</Btn>
        <Btn onClick={onConfirm} style={{ background: danger ? 'var(--accent2)' : 'var(--accent)' }}>
          {danger ? 'Xác nhận xoá' : 'Đồng ý'}
        </Btn>
      </div>
    </Modal>
  );
}