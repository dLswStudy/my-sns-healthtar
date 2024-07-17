"use client"
import {Modal} from "antd";

export default function AntdModal({children, open, title, onCancel}) {
    return (
            <Modal
                open={open}
                title={title}
                footer={''}
                onCancel={() => onCancel()}
                getContainer={() => document.getElementById('antd-modal-root')}
            >
                {children}
            </Modal>
    );
}
