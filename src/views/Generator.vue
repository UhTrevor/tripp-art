<template>
    <div class="wrap">
        <div class="options">
            <div class="generators">
                <div class="title">Generator:</div>
                <select label="Generator" v-model="selectedGenerator">
                    <option v-for="generator in generators" :key="generator.title" :value="generator">{{ generator.title
                        || generator.constructor.name }}</option>
                </select>
                <form-kit :actions="false" v-if="selectedGenerator && selectedGenerator.options" type="form" v-model="generatorOptions">
                    <form-kit-schema :schema="selectedGenerator.options"></form-kit-schema>
                </form-kit>
            </div>
            <div class="filters">
                <div class="title">Filters:</div>
                <div v-for="(filter, index) in filterList" :key="filter">
                    <select v-model="filter.selected">
                        <option v-for="key in Object.keys(filters)" :key="key">{{ key }}</option>
                    </select>
                    <button @click="filterList.splice(index, 1)">X</button>
                </div>
                <button @click="filterList.push({ selected: filters[0] })">Add Filter</button>

            </div>

            <button @click="generate">Generate</button>
        </div>
        <div class="canvas-container">
            <canvas ref="canvas" id="canvas">

            </canvas>
        </div>
    </div>
</template>


<script setup>
import Painter from "../utils/painter"
import { reactive, ref, onMounted, watch, watchEffect } from 'vue'
import generators from "../generators";
import filters from "../filters";
import { sleep } from "../utils/util";
import { FormKitSchema } from '@formkit/vue'

const canvas = ref(null);
const selectedGenerator = ref("")
const generatorOptions = ref(null);
const filterList = ref([]);
let painter, options;

async function generate() {
    painter.reset();

    const generator = new selectedGenerator.value();
    generator.setup(painter, generatorOptions.value)

    if (selectedGenerator.value.isIterable) {
        let stop = false;
        let iteration = 0;
        while (!stop) {
            let time = Date.now() + 10;
            while (Date.now() < time && !stop) {
                stop = generator.paint(painter, generatorOptions.value, iteration);
                iteration++;
            }
            await sleep(0);
        }
    } else {
        generator.paint(painter, options);
    }

    filterList.value.forEach(f => {
        let Filter = filters[f.selected];
        new Filter().filter(painter, options);
    });
}


onMounted(() => {
    painter = new Painter(canvas.value, window.innerWidth - 60, window.innerHeight - 60);
})


</script>

<style scoped>
.options {
    position: absolute;
    right: 5px;
    top: 5px;
    background-color: rgb(206, 206, 239);
    border: 2px solid black;
    border-radius: 2;
    padding: 20px;
    box-shadow: 2px 2px 4px #000;
    opacity: .1;
}

.options:hover {
    opacity: 1;
}

select{
    width: 150px;
}

.wrap {
    width: 100%;
    height: 100%;
    padding-top: 10px;
}

.canvas-container{
    display: inline-block;
    border: 10px solid #eee;
    box-shadow: 0 0 5px #888;
}


</style>