import InfiniteDrawer from "utils/infinite-drawer";

const drawer = new InfiniteDrawer({ draw: () => console.log("Hello!") });

drawer.play();

setTimeout(() => drawer.stop(), 1000);

onmessage = function (e: any) {
  console.log(e.data);
};
