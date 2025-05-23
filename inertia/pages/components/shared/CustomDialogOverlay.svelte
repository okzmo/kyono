<script lang="ts">
  import { Dialog, type WithoutChildrenOrChild } from 'bits-ui'
  import { fade } from 'svelte/transition'
  import type { Snippet } from 'svelte'

  let {
    ref = $bindable(null),
    duration = 75,
    children,
    ...restProps
  }: WithoutChildrenOrChild<Dialog.OverlayProps> & {
    duration?: number
    children?: Snippet
  } = $props()
</script>

<Dialog.Overlay forceMount bind:ref {...restProps} class="absolute inset-0 z-50 bg-black/80">
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade={{ duration }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Dialog.Overlay>
