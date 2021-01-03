import Button from './src/BasicButton.vue';
import PopConfirmButton from './src/PopConfirmButton.vue';
import { withInstall } from '@bfr-ui/utils/vue';

withInstall(Button, PopConfirmButton);
export { Button, PopConfirmButton };
