<template>
  <div>
    <div class="p-2">
      <input type="number" v-model="minutesInput" class="w-1/2 p-2 text-2xl text-center" />
    </div>
    <button @click="startCountdown" class="w-1/2 p-2 text-2xl text-center bg-blue-500 text-white">Start Countdown</button>
    <h1 class="text-6xl font-bold text-center font-mono">
      {{ displayedMinutes }}:{{ displayedSeconds }}
    </h1>
    <h4 class="text-2xl text-center">Sessions: {{ sessions.length }}</h4>
    <ol>
      <li v-for="session in sessions" :key="session" class="text-2xl text-center">{{ session }} minutes</li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const sessions = ref<Array<number>>([]);

// add ref for minutes and seconds
const minutes = ref(0);
const seconds = ref(0);

// add ref to minutes ui input
const minutesInput = ref(0);
const tempSavedMinuts = ref(0);

// add ref for displayed minuts and seconds that has prefix '0' when digits are below 10
const displayedMinutes = computed(() => {
  return minutes.value < 10 ? `0${minutes.value}` : minutes.value;
});
const displayedSeconds = computed(() => {
  return seconds.value < 10 ? `0${seconds.value}` : seconds.value;
});

// add ref for interval
let interval: any

// add interval for countdown timer
function startCountdown() {
  minutes.value = minutesInput.value;
  tempSavedMinuts.value = minutesInput.value;
  minutesInput.value = 0;
  interval = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--;
    } else {
      if (minutes.value > 0) {
        minutes.value--;
        seconds.value = 59;
      } else {
        clearInterval(interval);
        // push to sessions array with value of minutes
        sessions.value.push(tempSavedMinuts.value);
        pushToIndexedDB(tempSavedMinuts.value);
      }
    }
  }, 1000); // 1 second interval for countdown
}

// function to setup indexeddb of sessions that stores the minutes of each session and use auto increment id as key
async function setupIndexedDB() {
  const dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('sessions', 1);
    request.onupgradeneeded = (event) => {
      // @ts-ignore
      const db = event.target.result;
      db.createObjectStore('sessions', { autoIncrement: true });
    };
    request.onsuccess = (event) => {
      // @ts-ignore
      resolve(event.target.result);
    };
    request.onerror = () => {
      reject(new Error('Error opening database'));
    };
  });

  const db = await dbPromise;
  const dbTyped = db as IDBDatabase;
  const transaction = dbTyped.transaction('sessions', 'readwrite');
  const sessionsStore = transaction.objectStore('sessions');
  sessions.value = [];
  // @ts-ignore
  const cursorRequest = sessionsStore.openCursor();
  
  return new Promise((resolve, reject) => {
    cursorRequest.onsuccess = (event) => {
      // @ts-ignore
      const cursor = event.target.result;
      if (cursor) {
        sessions.value.push(cursor.value);
        cursor.continue();
      } else {
        resolve(sessions.value);
      }
    };
    cursorRequest.onerror = () => {
      reject(new Error('Error opening cursor'));
    };
  });
}

// function to push to indexed db bringing the value of minutes which is a number
function pushToIndexedDB(value: number) {
  indexedDB.open('sessions', 1).onsuccess = (event) => {
    // @ts-ignore
    const db = event.target.result;
    const transaction = db.transaction('sessions', 'readwrite');
    const sessionsStore = transaction.objectStore('sessions');
    sessionsStore.add(value);
  };
}

// function to load sessions from indexed db on first load and save it to sessions ref
function loadSessions() {
  indexedDB.open('sessions', 1).onsuccess = (event) => {
    // @ts-ignore
    const db = event.target.result;
    const transaction = db.transaction('sessions', 'readwrite');
    const sessionsStore = transaction.objectStore('sessions');
    sessions.value = [];
    // @ts-ignore
    sessionsStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        sessions.value.push(cursor.value);
        cursor.continue();
      }
    };
  };
}


// Call the function to trigger the countdown
onMounted(async () => {
  await setupIndexedDB();
  loadSessions();
});

// on unmounted, clear the interval
onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
/* Add your styles here */
</style>