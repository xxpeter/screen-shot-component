<template>
  <div class="screen-shot">
    <div
      ref="ssCropBox"
      :style="{height: cropH + 'px', width: cropW + 'px', left: posX + 'px', top: posY + 'px'}"
      style="position:absolute;border:1px solid black;"
    >
      <div
        ref="ssDragBg"
        style="height:100%;cursor:move"
      />
      <div
        ref="dragLeftTop"
        class="drag-point"
        style="left:-3px; top:-3px; cursor:nw-resize;"
      />
      <div
        ref="dragLeftBot"
        class="drag-point"
        style="left:-3px; bottom:-3px; cursor:sw-resize;"
      />
      <div
        ref="dragRightTop"
        class="drag-point"
        style="right:-3px; top:-3px; cursor:ne-resize;"
      />
      <div
        ref="dragRightBot"
        class="drag-point"
        style="right:-3px; bottom:-3px; cursor:se-resize;"
      />
      <div
        ref="dragTopCenter"
        class="drag-point"
        style="top:-3px; left:50%; margin-left:-3px; cursor:n-resize;"
      />
      <div
        ref="dragBotCenter"
        class="drag-point"
        style="bottom:-3px; left:50%; margin-left:-3px; cursor:s-resize;"
      />
      <div
        ref="dragRightCenter"
        class="drag-point"
        style="right:-3px; top:50%; margin-top:-3px; cursor:e-resize;"
      />
      <div
        ref="dragLeftCenter"
        class="drag-point"
        style="left:-3px; top:50%; margin-top:-3px; cursor:w-resize;"
      />
      <button
        v-if="startShoting"
        @click="confirm"
      >
        确认
      </button>
      <button
        v-if="startShoting"
        @click="reset"
      >
        取消
      </button>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

export default {
  data() {
    return {
      cropH: 0,
      cropW: 0,
      posX: 0,
      posY: 0,
      startShoting: false,
      originX: 0,
      originY: 0,
      dragParams: {
        startX: 0,
        startY: 0,
      },
    };
  },
  mounted() {
    document.onmousedown = (e) => {
      this.onmousedown(e);
    };
    // 绑定拖拽
    this.startDrag(this.$refs.ssDragBg, this.$refs.ssCropBox, 'drag');
    // 绑定拉伸
    this.startDrag(this.$refs.dragLeftTop, this.$refs.ssCropBox, 'nw');
    this.startDrag(this.$refs.dragLeftBot, this.$refs.ssCropBox, 'sw');
    this.startDrag(this.$refs.dragRightTop, this.$refs.ssCropBox, 'ne');
    this.startDrag(this.$refs.dragRightBot, this.$refs.ssCropBox, 'se');
    this.startDrag(this.$refs.dragTopCenter, this.$refs.ssCropBox, 'n');
    this.startDrag(this.$refs.dragBotCenter, this.$refs.ssCropBox, 's');
    this.startDrag(this.$refs.dragRightCenter, this.$refs.ssCropBox, 'e');
    this.startDrag(this.$refs.dragLeftCenter, this.$refs.ssCropBox, 'w');
  },
  methods: {
    onmousedown(e) {
      if (this.startShoting) {
        return;
      }
      this.startShoting = true;
      this.posX = e.clientX;
      this.posY = e.clientY;
      this.originX = e.clientX;
      this.originY = e.clientY;
      document.onmousemove = (ev) => {
        this.onmousemove(ev);
      };
      document.onmouseup = function () {
        document.onmousedown = null;
        document.onmousemove = null;
      };
    },
    onmousemove(e) {
      const x = e.clientX;
      const y = e.clientY;
      this.cropH = y - this.posY;
      if (x >= this.originX) {
        this.posX = this.originX;
        this.cropW = x - this.originX;
      } else {
        this.cropW = Math.abs(x - this.originX);
        this.posX = x;
      }
      if (y >= this.originY) {
        this.posY = this.originY;
        this.cropH = y - this.originY;
      } else {
        this.cropH = Math.abs(y - this.originY);
        this.posY = y;
      }
    },
    startDrag(point, target, kind) {
      const vm = this;
      const ele = point;
      ele.onmousedown = function (event) {
        const {
          dragParams, posX, posY, cropH, cropW,
        } = vm;
        dragParams.startX = event.clientX;
        dragParams.startY = event.clientY;
        document.onmousemove = function (ev) {
          const nowX = ev.clientX;
          const nowY = ev.clientY;
          const disX = nowX - dragParams.startX;
          console.log(disX);
          const disY = nowY - dragParams.startY;
          if (kind === 'n') { // 上拉伸
            vm.posY = parseInt(posY, 10) + vm.posY;
            vm.cropH = parseInt(cropH, 10) - disY;
          } else if (kind === 'w') { // 左拉伸
            vm.posX = parseInt(posX, 10) + disX;
            vm.cropW = parseInt(cropW, 10) - disX;
          } else if (kind === 'e') { // 右拉伸
            vm.cropW = parseInt(cropW, 10) + disX;
          } else if (kind === 's') { // 下拉伸
            vm.cropH = parseInt(cropH, 10) + disY;
          } else if (kind === 'nw') { // 左上拉伸
            vm.posX = parseInt(posX, 10) + disX;
            vm.cropW = parseInt(cropW, 10) - disX;
            vm.posY = parseInt(posY, 10) + disY;
            vm.cropH = parseInt(cropH, 10) - disY;
          } else if (kind === 'ne') { // 右上拉伸
            vm.posY = parseInt(posY, 10) + disY;
            vm.cropH = parseInt(cropH, 10) - disY;
            vm.cropW = parseInt(cropW, 10) + disX;
          } else if (kind === 'sw') { // 左下拉伸
            vm.posX = parseInt(posX, 10) + disX;
            vm.cropW = parseInt(cropW, 10) - disX;
            vm.cropH = parseInt(cropH, 10) + disY;
          } else if (kind === 'se') { // 右下拉伸
            vm.cropW = parseInt(cropW, 10) + disX;
            vm.cropH = parseInt(cropH, 10) + disY;
          } else { // 移动
            vm.posX = parseInt(posX, 10) + disX;
            vm.posY = parseInt(posY, 10) + disY;
          }
          document.onmouseup = function () {
            document.onmousemove = null;
          };
        };
      };
    },
    confirm() {
      const vm = this;
      domtoimage.toPng(document.body)
        .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          img.style.position = 'absolute';
          img.style.top = 0;
          img.style.left = 0;
          img.style.zIndex = -1;
          document.body.appendChild(img);
          html2canvas(img, {
            x: vm.posX,
            y: vm.posY,
            height: vm.cropH,
            width: vm.cropW,
          }).then((canvas) => {
            img.parentNode.removeChild(img);
            const src = canvas.toDataURL(); // 导出图片
            const link = document.createElement('a');
            link.download = 'my-image-name.jpeg';
            link.href = src;
            link.click();
          });
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        });
    },
    reset() {
      this.posX = 0;
      this.posY = 0;
      this.cropW = 0;
      this.cropH = 0;
      this.startShoting = false;
      document.onmousedown = (e) => {
        this.onmousedown(e);
      };
    },
  },
};
</script>
<style scoped>
.screen-shot{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.drag-point{
  position: absolute;
  width: 4px;
  height: 4px;
  border: 1px solid #000;
  background:white;
  overflow: hidden;
}
</style>
