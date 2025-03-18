<script lang="ts">
  let { error } = $props()
</script>

<p class="text-red-400 fixed left-1/2 -translate-x-1/2 top-[35%]">{error}</p>

<div class="min-h-dvh w-full flex items-center justify-center">
  <a
    href="/signin/github"
    class="bg-zinc-900 border border-zinc-800 px-5 py-2 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-colors duration-75"
  >
    Login with GitHub
  </a>
</div>
