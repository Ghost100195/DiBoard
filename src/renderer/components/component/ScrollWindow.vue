<template>
    <v-layout column>
        <v-flex xs12 style="flex: 0 1" v-if="headerText && scrollDownButtonText">
            <v-layout row justify-space-between>
                <h1>{{ headerText }} </h1>
                <v-btn @click="forceScrollDown" v-if="!isBottom">{{ scrollDownButtonText }}</v-btn>
            </v-layout>
        </v-flex>
        
        <v-flex xs12 
                ref="scrollContainer"
                @scroll="scroll" 
                class="scroll-y">
            <slot></slot>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    data() {
        return {
            scrolling: false,
            isAutoScrolling: false,
            lastScrollTopPosition: 0,
            isBottom: true
        };
    },
    methods: {
        forceScrollDown(){
            this.lastScrollTopPosition =  this.$refs.scrollContainer.scrollTop;
            this.scrolling = false;
            this.scrollTo('bottom');
        },
        scroll(){
            const scrollContainerSrollTopPosition = this.$refs.scrollContainer.scrollTop;
            if(this.scrolling){
                this.scrolling = scrollContainerSrollTopPosition < this.maxScrollTop() - 25;
                this.isBottom = !this.scrolling;
            }else{
                if(this.lastScrollTopPosition > scrollContainerSrollTopPosition 
                    && scrollContainerSrollTopPosition <  this.maxScrollTop() - 25){
                    this.scrolling = true;
                    this.isAutoScrolling = false;
                }else{
                    this.lastScrollTopPosition = scrollContainerSrollTopPosition;
                    this.isBottom = true;
                    this.scrolling = false;
                }
            }
        },
        scrollTo(position){
            if(!this.isAutoScrolling && !this.scrolling) {
                const scrollTime = this.scrollTime ? this.scrollTime : 400;
                const scrollStepSize = this.scrollStepSize ? this.scrollStepSize : 30;
                this.isAutoScrolling = true;
                this.autoScrollTo(position, scrollTime, scrollStepSize);
            }
        },
        scrollDistance(targetPosition, center = false){
            if(targetPosition === 'bottom'){
                targetPosition = this.maxScrollTop();
            }
            const targetScrollTop = center ? this.$refs.scrollContainer.scrollTop/(this.windowHeight()/2) : this.$refs.scrollContainer.scrollTop;
            return Math.abs(targetScrollTop - targetPosition);
        },
        autoScrollTo(targetPosition, time, step){
            let travel = 0;
            const steps = (time/step) + 1;
            let finishedRounds = 1;
            
            const animation = setInterval(() => {
                travel = Math.ceil(this.scrollDistance(targetPosition)/(steps - finishedRounds));
                finishedRounds++;
                if(travel <= 1 || this.scrolling || finishedRounds >= steps) {
                    clearInterval(animation);
                    this.isAutoScrolling = false;
                }
                
                this.$refs.scrollContainer.scrollTop += travel;
            }, step);
        },
        windowHeight(){
            const height = this.footerTop - (this.$refs.scrollContainer.getBoundingClientRect().top + 16 );
            this.$refs.scrollContainer.style.maxHeight = height + "px";
            return height;
        },
        maxScrollTop(){
            return  this.$refs.scrollContainer.scrollHeight - this.windowHeight();
        }
    },
    props: ['footerTop', 'headerText', 'scrollDownButtonText', 'scrollTime', 'scrollStepSize'],
    watch: {
        footerTop(newEle, oldEle){
            this.scrollTo('bottom');
        }
    },
    mounted(){     
        this.$on('scrollDown',  () => {
            this.scrollTo('bottom');
        });
    }
}
</script>

<style scoped>
    .scroll_window_header{
        flex: 0 1 0%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
