import { useMemo, useState } from 'react';
import DynamicForm, { FormPropsType } from './components/DynamicForm';

function App() {
  const [values, setValues] = useState({
    name: 'Akashdeep Patra',
    email: 'adeep8961@gmail.com',
    buttonGroup: 'opt-1',
    select: '',
    pricingModel: 'click',
    clicksPerDay:190,
    bidCpm:0
  });

  const formData: FormPropsType<{ name: string; email: string }> = useMemo(
    () => ({
      formData: [
        {
          name: 'pricingModel',
          label: 'Pricing Model',
          placeholder: 'Placeholder Text',
          type: 'dropdown',
          options: [
            {
              label: 'Cost per 1000 impressions',
              value: 'impression',
            },
            {
              label: 'Cost per Click',
              value: 'click',
            },
            {
              label: 'Lowest cost bid',
              value: 'bid',
            },
          ],
        },
        {
          name:'clicksPerDay',
          label:"Total Click per day",
          type: "number",
          shouldRender: values.pricingModel==="click"
        },
        {
          name:'bidCpm',
          label:"BID cpm",
          type: "number",
          shouldRender: values.pricingModel==="click"
        }
      ],
    }),
    [values]
  );

  return (
    <div className=' p-10 bg-gray-300 h-[100vh]'>
      <DynamicForm {...formData} values={values} setValues={setValues} />
    </div>
  );
}

export default App;
