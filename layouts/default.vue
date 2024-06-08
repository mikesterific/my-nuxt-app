<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <p>© 2024 My Nuxt App</p>
    </footer>
  </div>
</template>
