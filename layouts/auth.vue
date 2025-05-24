<template>
  <div class="grid lg:grid-cols-2 h-screen">
    <div class="flex items-center justify-center h-screen px-12">
      <slot />
    </div>

    <div class="hidden lg:block h-full">
      <img src="/images/login/login-photo.jpg" alt="Imagem"
        class="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale" />
    </div>
  </div>
</template>