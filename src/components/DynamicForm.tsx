import React, { useCallback } from 'react';
import { Button, Form, Input, Radio, Select } from 'antd';
import debounce from 'lodash.debounce';
import { useForm } from 'antd/lib/form/Form';
import clsx from 'clsx';
import { Rule } from 'antd/lib/form';

export interface ShouldRenderInterface {
  shouldRender?: boolean | ((params?: any) => boolean);
}
export interface Disabled {
  disabled?: boolean;
}
export interface OptionType extends ShouldRenderInterface, Disabled {
  value: string;
  label: string;
}

export interface FormItemType extends ShouldRenderInterface {
  name: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  options?: Array<OptionType>;
  placeholder?: string;
  rules?: Array<Rule>;
  gridColumn?: 2 | 4 | 6 | 8 | 10;
  type?:
    | 'button'
    | 'textarea'
    | 'button-group'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'dropdown'
    | 'week';
}

//filter to handle should render callback
const shouldRenderFilter = <T extends ShouldRenderInterface>({
  shouldRender,
}: T) =>
  typeof shouldRender === 'function'
    ? shouldRender()
    : shouldRender === undefined || shouldRender === null
    ? true
    : shouldRender;

const generateClassNames = (item: FormItemType) =>
  clsx({
    'w-[20%]': item.gridColumn === 2 || !item.gridColumn,
    'w-[40%]': item.gridColumn === 4,
    'w-[60%]': item.gridColumn === 6,
    'w-[80%]': item.gridColumn === 8,
    'w-[100%]': item.gridColumn === 10,
  });

export interface FormPropsType<T = any> {
  values?: T;
  setValues?: React.Dispatch<React.SetStateAction<T>>;
  formData: Array<FormItemType>;
  submitText?: string;
  onChange?: (values: T) => void;
  onFinish?: (values: T) => void;
}

//The Form builder component

const DynamicForm = (props: FormPropsType) => {
  const { formData, submitText } = props;
  const [form] = useForm();
  // const [values,setValues]
  const onFinish = () => {
    const values = form.getFieldsValue();
    props?.onFinish?.(values);
  };

  const onChange = useCallback(
    debounce(async (e: React.ChangeEvent<HTMLFormElement>, id?: string) => {
      if (id) {
        await form.validateFields([id]);
      } else if (e?.target?.id) {
        await form.validateFields([e.target.id]);
      }
      const values = form.getFieldsValue();
      props?.setValues?.(values);
      props?.onChange?.(values);
    }, 300),
    []
  );
  console.log('====================================');
  console.log(formData?.filter(shouldRenderFilter));
  console.log('====================================');
  return (
    <Form
      initialValues={props.values}
      onFinish={onFinish}
      autoComplete='true'
      layout='vertical'
      onChange={onChange}
      form={form}
    >
      {formData?.filter(shouldRenderFilter).map((formItem) => {
        const {
          type,
          maxLength,
          required,
          label,
          name,
          options,
          rules,
          placeholder,
        } = formItem;
        switch (type) {
          case 'dropdown':
            return (
              <Form.Item
                name={name}
                rules={rules}
                className={generateClassNames(formItem)}
                required={required}
                label={label}
                key={name}
              >
                <Select
                  placeholder={placeholder}
                  onChange={(e) => onChange(e, name)}
                  options={options?.filter(shouldRenderFilter)}
                />
              </Form.Item>
            );
          case 'button-group':
            return (
              <Form.Item
                name={name}
                rules={rules}
                className={generateClassNames(formItem)}
                required={required}
                label={label}
                key={name}
              >
                <Radio.Group className='flex' optionType='button'>
                  {options?.filter(shouldRenderFilter)?.map((opt) => (
                    <Radio.Button
                      disabled={opt?.disabled}
                      className=' flex-[1]'
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            );

          case 'textarea':
            return (
              <Form.Item
                name={name}
                rules={rules}
                className={generateClassNames(formItem)}
                required={required}
                label={label}
                key={name}
              >
                <Input.TextArea
                  maxLength={maxLength}
                  autoSize
                  placeholder={placeholder}
                />
              </Form.Item>
            );

          default:
            return (
              <Form.Item
                name={name}
                rules={rules}
                className={generateClassNames(formItem)}
                required={required}
                label={label}
                key={name}
              >
                <Input placeholder={placeholder} type={type} />
              </Form.Item>
            );
        }
      })}
      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          className=' bg-blue-500 rounded-md'
        >
          {submitText ?? 'Submit'}
        </Button>
      </Form.Item>
    </Form>
  );
};
const areEqual = (prevProps: FormPropsType, nextProps: FormPropsType) => {
  return prevProps.formData === nextProps.formData;
};
export default React.memo(DynamicForm, areEqual);
