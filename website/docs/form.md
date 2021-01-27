### form

:::demo
```html
<template>
  <bfr-form 
  :wrapper-col="{span:14}" 
  :label-width="100" 
  :model="model" 
  :schemas="schemas">
  <template #genderContent="{model, setModel}">
   <a-radio-group :defaultValue="model" @change="(e)=>setModel(e.target.value)">
    <a-radio value="男">男</a-radio>
    <a-radio value="女">女</a-radio>
   </a-radio-group>
  </template>
  </bfr-form>
</template>
<script>
export default {
  data() {
    return {
      model:{ name:'', gender:'男' },
      schemas: [{
        itemProps: {
          label:'姓名',
          wrapperCol:{
            span:8
          },
        },
        component: 'input',
        dataIndex: 'name',
        },
        {
        itemProps: {
          label:'姓名',
          wrapperCol:{
            span:8
          },
        },
        slots: {
          content:'genderContent'
        },
        dataIndex: 'gender',
        componentProps: {
          options:[{label:'男',value:'男'},{label:'女',value:'女'}]
        }
        }]
    }
  }
}
</script>
```
:::