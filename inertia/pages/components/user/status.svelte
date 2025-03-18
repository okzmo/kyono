<script lang="ts">
  interface Props {
    ownerIsEditing: boolean
    editingStatus: boolean
    status: string | null
    editingAvatar: boolean
  }

  let {
    status = $bindable(),
    editingStatus = $bindable(),
    ownerIsEditing,
    editingAvatar,
  }: Props = $props()
</script>

<div
  class="md:absolute md:top-4 md:right-4 px-3 bg-zinc-800/35 backdrop-blur-2xl rounded-full py-1 flex items-center justify-center gap-x-2 overflow-hidden max-w-[75%] border border-zinc-50/10 md:border-none shrink-0"
>
  {#if editingStatus && !editingAvatar}
    <input type="text" class="focus-visible:outline-none text-sm" bind:value={status} />
  {:else if ownerIsEditing && !status}
    <p class="text-sm truncate">
      {status || '+'}
    </p>
  {:else}
    <p class="text-sm truncate">
      {status}
    </p>
  {/if}

  {#if ownerIsEditing && !editingStatus && !editingAvatar}
    <button
      onclick={() => (editingStatus = !editingStatus)}
      aria-label="Edit status"
      class="absolute inset-0 border border-zinc-50/60 active:opacity-65 opacity-0 focus-visible:opacity-100 hover:cursor-pointer hover:opacity-100 transition-opacity duration-75 rounded-full"
    >
    </button>
  {/if}
</div>
