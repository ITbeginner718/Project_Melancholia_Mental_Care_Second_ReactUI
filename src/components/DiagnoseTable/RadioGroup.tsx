
import React, { useState } from 'react';

interface RadioGroupProps {
  label: string;
  children: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

interface RadioProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean;
  value?: string;
}

function RadioGroup({ label, children, onChange, disabled }: RadioGroupProps) {
  // 현재 선택된 라디오 버튼의 값을 관리
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // 라디오 버튼이 변경될 때 호출되는 함수
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    //부모 컴포넌트에서 제공한 onChange 함수가 있다면 호출
    //BDI_Survey에서 정의한 함수
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <fieldset>
      {/* 자식 컴포넌트들을 순회 */}
      {React.Children.map(children, (child) => {
        
        if (React.isValidElement<RadioProps>(child)) {
            //  자식 컴포넌트의 props를 수정
          return React.cloneElement(child, {
            // 이벤트가 발생할 때마다 새로 렌더링
            onChange: handleChange,
            checked: child.props.value === selectedValue,
            // 그룹의 disabled prop이나 개별 라디오 버튼의 disabled prop으로 설정 
            disabled: disabled || child.props.disabled,
          });
        }
        return child;
      })}
    </fieldset>
  );
}

export default RadioGroup;