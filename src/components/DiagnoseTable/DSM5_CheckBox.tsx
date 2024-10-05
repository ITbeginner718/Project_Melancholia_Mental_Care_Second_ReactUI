interface CheckboxItemProps {
    id: string;
    question: string;
    code: string;
    onCheckedItem: (checked: boolean, item: { id: string; code: string; question: string; }) => void;
}



//구조 파괴된 요소가 모두 사용되지 않습니다 => props들 사용안하면 발생하는 경고 
export default function DSM5CheckBox({ id, code, question, onCheckedItem }: CheckboxItemProps) {

    return (
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', width: '100%', margin: 0, cursor: 'pointer' }}>
                <input
                    type='checkbox'
                    id={id}
                    onChange={(e) => {
                        onCheckedItem(e.target.checked, { id, code, question });
                    }}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                />
                <span>{question}</span>
            </label>
        </div>
    )
}