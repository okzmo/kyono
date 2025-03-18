<script lang="ts">
  import SolarGalleryEditBoldDuotone from '~icons/solar/gallery-edit-bold-duotone'
  import Cropper from 'svelte-easy-crop'
  import { twJoin } from 'tailwind-merge'

  let {
    ownerIsEditing,
    editingBanner = $bindable(),
    currentBanner,
    newBanner = $bindable(),
    details = $bindable(),
    editingAvatar,
    presentation = false,
  } = $props()

  let bannerImageFromUser = $state<string | null>()
  let crop = $state({ x: 0, y: 0 })
  let zoom = $state(4)
  let minZoom = $state(3)
  let fileInput = $state<HTMLInputElement | null>()

  function editBannerImage() {
    if (!fileInput) return
    editingBanner = true

    fileInput.click()
  }

  function onCancel() {
    editingBanner = false
  }

  function onFile(e: Event) {
    const target = e.target as HTMLInputElement
    const image = target.files?.[0]

    if (image) {
      const dataUrl = URL.createObjectURL(image)
      const img = new Image()

      img.onload = () => {
        const aspectBanner = 424 / 300
        const aspectImage = img.naturalWidth / img.naturalHeight

        minZoom = aspectImage > 1 ? aspectImage / aspectBanner : aspectBanner / aspectImage
        zoom = minZoom

        URL.revokeObjectURL(dataUrl)
      }

      img.src = dataUrl
      bannerImageFromUser = dataUrl

      newBanner = image
    }
  }
</script>

{#if ownerIsEditing && !editingBanner && !editingAvatar}
  <button
    onclick={editBannerImage}
    aria-label="Edit background image"
    class="absolute left-3 top-3 z-10 bg-zinc-800/65 hover:bg-zinc-800 transition-colors duration-75 backdrop-blur-2xl h-8 w-8 rounded-md flex justify-center items-center hover:cursor-pointer focus-visible:ring-1 focus-visible:outline-none active:bg-zinc-800/80"
  >
    <SolarGalleryEditBoldDuotone />
  </button>
{/if}
<img
  src={currentBanner}
  alt=""
  class={twJoin(
    'h-full w-full object-cover absolute select-none',
    presentation ? 'rounded-xl' : ''
  )}
/>

{#if ownerIsEditing && !editingAvatar}
  <input
    bind:this={fileInput}
    onchange={onFile}
    oncancel={onCancel}
    type="file"
    class="invisible h-0 w-0 absolute opacity-0"
  />
{/if}

{#if ownerIsEditing && editingBanner && bannerImageFromUser && !editingAvatar}
  <Cropper
    image={bannerImageFromUser}
    bind:crop
    bind:zoom
    cropShape="rect"
    cropSize={{ height: 300, width: 424 }}
    maxZoom={5}
    {minZoom}
    oncropcomplete={(e) => {
      details = e.pixels
    }}
  />
{/if}
