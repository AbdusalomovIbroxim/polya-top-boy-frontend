<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden pb-20" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div>
      <div class="flex items-center bg-white p-4 pb-2 justify-between">
        <h2 class="text-[#131711] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">Profile</h2>
        <div class="flex w-12 items-center justify-end">
          <button
            class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#131711] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          >
            <div class="text-[#131711]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"
                ></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
      <div class="flex p-4 @container">
        <div class="flex w-full flex-col gap-4 items-start">
          <div class="flex gap-4 flex-col items-start">
            <div
              class="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
              style='background-image: url("https://cdn.usegalileo.ai/sdxl10/40f70546-ecd7-4361-be87-04d23971368e.png");'
            ></div>
            <div class="flex flex-col justify-center">
              <p class="text-[#131711] text-[22px] font-bold leading-tight tracking-[-0.015em]">Emily</p>
              <p class="text-[#6c8764] text-base font-normal leading-normal">San Francisco, CA</p>
              <p class="text-[#6c8764] text-base font-normal leading-normal">Joined in 2020</p>
            </div>
          </div>
          <button
            class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f4f0] text-[#131711] text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto"
          >
            <span class="truncate">Invite to Play</span>
          </button>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
        <div class="flex items-center gap-4">
          <div class="text-[#131711] flex items-center justify-center rounded-lg bg-[#f1f4f0] shrink-0 size-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"
              ></path>
            </svg>
          </div>
          <p class="text-[#131711] text-base font-normal leading-normal flex-1 truncate">Playing Level</p>
        </div>
        <div class="shrink-0"><p class="text-[#131711] text-base font-normal leading-normal">Intermediate</p></div>
      </div>
      <div class="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
        <div class="flex items-center gap-4">
          <div class="text-[#131711] flex items-center justify-center rounded-lg bg-[#f1f4f0] shrink-0 size-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm76.52,147.42H170.9l-9.26-12.76,12.63-36.78,15-4.89,26.24,20.13A87.38,87.38,0,0,1,204.52,171.42Zm-164-34.3L66.71,117l15,4.89,12.63,36.78L85.1,171.42H51.48A87.38,87.38,0,0,1,40.47,137.12Zm10-50.64,5.51,18.6L40.71,116.77A87.33,87.33,0,0,1,50.43,86.48ZM109,152,97.54,118.65,128,97.71l30.46,20.94L147,152Zm91.07-46.92,5.51-18.6a87.33,87.33,0,0,1,9.72,30.29Zm-6.2-35.38-9.51,32.08-15.07,4.89L136,83.79V68.21l29.09-20A88.58,88.58,0,0,1,193.86,69.7ZM146.07,41.87,128,54.29,109.93,41.87a88.24,88.24,0,0,1,36.14,0ZM90.91,48.21l29.09,20V83.79L86.72,106.67l-15.07-4.89L62.14,69.7A88.58,88.58,0,0,1,90.91,48.21ZM63.15,187.42H83.52l7.17,20.27A88.4,88.4,0,0,1,63.15,187.42ZM110,214.13,98.12,180.71,107.35,168h41.3l9.23,12.71-11.83,33.42a88,88,0,0,1-36.1,0Zm55.36-6.44,7.17-20.27h20.37A88.4,88.4,0,0,1,165.31,207.69Z"
              ></path>
            </svg>
          </div>
          <p class="text-[#131711] text-base font-normal leading-normal flex-1 truncate">Position</p>
        </div>
        <div class="shrink-0"><p class="text-[#131711] text-base font-normal leading-normal">Midfielder</p></div>
      </div>
      <h2 class="text-[#131711] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">About</h2>
      <p class="text-[#131711] text-base font-normal leading-normal pb-3 pt-1 px-4">I'm a big fan of Messi and I also love playing soccer.</p>
      <h2 class="text-[#131711] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Friends</h2>
      <div class="flex items-center px-4 py-3 justify-start">
        <div class="overflow-visible w-[34px]">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover border-white bg-[#f1f4f0] text-[#6c8764] rounded-full flex items-center justify-center size-11 border-4"
            style='background-image: url("https://cdn.usegalileo.ai/sdxl10/b0a1e75e-45ae-4af9-b0c3-ad5e27bd5022.png");'
          ></div>
        </div>
        <div class="overflow-visible w-[34px]">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover border-white bg-[#f1f4f0] text-[#6c8764] rounded-full flex items-center justify-center size-11 border-4"
            style='background-image: url("https://cdn.usegalileo.ai/sdxl10/ebc3de23-7288-46dc-84c7-cc09016e8291.png");'
          ></div>
        </div>
        <div class="overflow-visible w-11">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover border-white bg-[#f1f4f0] text-[#6c8764] rounded-full flex items-center justify-center size-11 border-4"
            style='background-image: url("https://cdn.usegalileo.ai/sdxl10/d099e1f2-8e8a-4b3f-b103-7dcde7eb4153.png");'
          ></div>
        </div>
      </div>
    </div>
    
    <NavigationBar />
  </div>
</template>

<script>
import NavigationBar from './NavigationBar.vue'

export default {
  name: 'ProfilePage',
  components: {
    NavigationBar
  }
}
</script> 