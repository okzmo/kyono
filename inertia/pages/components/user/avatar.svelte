<script lang="ts">
  import Cropper from 'svelte-easy-crop'
  import SolarPenBoldDuotone from '~icons/solar/pen-bold-duotone'
  interface Props {
    ownerIsEditing: boolean
    editingAvatar: boolean
    avatarUrl: string
    newAvatar: any
    details: {
      x: number
      y: number
      width: number
      height: number
    }
  }

  let {
    avatarUrl,
    editingAvatar = $bindable(),
    ownerIsEditing,
    newAvatar = $bindable(),
    details = $bindable(),
  }: Props = $props()

  let avatarImageFromUser = $state<string | null>()
  let crop = $state({ x: 0, y: 0 })
  let zoom = $state(4)
  let minZoom = $state(3)
  let fileInput = $state<HTMLInputElement | null>()

  function editAvatarImage() {
    if (!fileInput) return
    editingAvatar = true

    fileInput.click()
  }

  function onCancel() {
    editingAvatar = false
  }

  function onFile(e: Event) {
    const target = e.target as HTMLInputElement
    const image = target.files?.[0]

    if (image) {
      const dataUrl = URL.createObjectURL(image)
      const img = new Image()

      img.onload = () => {
        const aspectAvatar = 1
        const aspectImage = img.naturalWidth / img.naturalHeight

        minZoom = aspectImage >= 1 ? aspectImage / aspectAvatar : aspectAvatar / aspectImage
        zoom = minZoom

        URL.revokeObjectURL(dataUrl)
      }

      img.src = dataUrl
      avatarImageFromUser = dataUrl

      newAvatar = image
    }
  }
</script>

<figure class="h-[6rem] w-[6rem] rounded-full ml-5 overflow-hidden relative">
  <img src={avatarUrl} alt="burning car" class="h-full w-full object-cover" />
  {#if ownerIsEditing}
    <button
      onclick={editAvatarImage}
      aria-label="Edit avatar image"
      class="absolute inset-0 opacity-0 bg-black/50 focus-visible:opacity-100 hover:cursor-pointer hover:opacity-100 transition-opacity duration-75 flex justify-center items-center"
    >
      <SolarPenBoldDuotone height={28} width={28} />
    </button>
  {/if}

  {#if ownerIsEditing}
    <input
      bind:this={fileInput}
      onchange={onFile}
      oncancel={onCancel}
      type="file"
      class="invisible h-0 w-0 absolute opacity-0"
    />
  {/if}

  {#if ownerIsEditing && editingAvatar && avatarImageFromUser}
    <Cropper
      image={avatarImageFromUser}
      bind:crop
      bind:zoom
      cropShape="round"
      cropSize={{ height: 96, width: 96 }}
      maxZoom={5}
      {minZoom}
      oncropcomplete={(e) => {
        details = e.pixels
      }}
    />
  {/if}
</figure>
