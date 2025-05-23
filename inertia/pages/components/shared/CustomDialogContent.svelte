<script lang="ts">
  import { Dialog, type WithoutChildrenOrChild } from 'bits-ui'
  import type { Snippet } from 'svelte'
  import { flyBlur } from '~/utils/transitions'

  let {
    ref = $bindable(null),
    duration = 300,
    children,
    ...restProps
  }: WithoutChildrenOrChild<Dialog.ContentProps> & {
    duration?: number
    children?: Snippet
  } = $props()
</script>

<Dialog.Content
  forceMount
  bind:ref
  {...restProps}
  class="rounded-lg bg-zinc-900 shadow-xl outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border border-zinc-800 p-5 sm:max-w-[490px] md:w-full"
>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:flyBlur={{ duration, y: 20 }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Dialog.Content>
