import { reactive } from "vue";

export interface GlobalData {
  model:  string;
}

export const store: GlobalData = reactive({
  model: 'text-davinci-003',
  setModelParam(e: any) {
    this.model = e.target.parentElement.childNodes[0].childNodes[0].textContent;
  }
});
