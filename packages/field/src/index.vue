<template>
  <template v-if="valueType=='text'">
    {{ text }}
  </template>
  <field-date-time
    v-if="valueType=='date'"
    :text="text"
    :format="$attrs.format||'YYYY-MM-DD'"
    v-bind="$attrs"
  />
  <field-date-time
    v-if="valueType=='datetime'"
    :text="text"
    :format="$attrs.format||'YYYY-MM-DD HH:mm:ss'"
    v-bind="$attrs"
  />
  <field-date-time
    v-if="valueType=='time'"
    :text="text"
    :format="$attrs.format||'HH:mm:ss'"
    v-bind="$attrs"
  />
  <field-digit v-if="valueType=='digit'" :text="text" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import FieldDateTime from './components/DateTime.vue';
import FieldDigit from './components/Digit.vue';

type IFieldType = PropType<'text'|'date'|'datetime'|'time'|'digit'>;
export default defineComponent({
  name: 'BfrTable',
  components: {
    FieldDateTime,
    FieldDigit,
  },
  props: {
    valueType: {
      type: String as IFieldType,
      validator(val: string) {
        return ['text','date','datetime','time','digit'].includes(val);
      },
    },
    text: {
      type: String as any,
    },
  },
});
</script>
