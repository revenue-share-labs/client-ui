import styles from './TypeItem.module.scss';

interface ItemProps {
  label: string;
  disabled: boolean;
}

export function TypeItem({ label, disabled, ...others }: ItemProps) {
    return (
        <div {...others}>
            <div className={styles.item}>
                <div className={styles.label}>{label}</div>
                {disabled && <div className={styles.soon}>Soon</div>}
            </div>
        </div>
    );
}
