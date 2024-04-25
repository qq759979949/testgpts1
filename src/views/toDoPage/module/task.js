import MyTask from './MyTask.vue';
import ReceivedTask from './ReceivedTask.vue';
import ApprovalTask from './ApprovalTask.vue';
import ExcutedTask from './ExcutedTask.vue';
import ActivedTask from './ActivedTask.vue';
import ActivedProcess from './ActivedProcess.vue';

const components = {
  [MyTask.name]: MyTask,
  [ReceivedTask.name]: ReceivedTask,
  [ApprovalTask.name]: ApprovalTask,
  [ExcutedTask.name]: ExcutedTask,
  [ActivedTask.name]: ActivedTask,
  [ActivedProcess.name]: ActivedProcess,
};

export default components;
