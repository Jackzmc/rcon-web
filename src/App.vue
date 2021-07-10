<template>
<div id="app">
  <section class="hero is-info">
    <div class="hero-body">
      <p class="title">
        RCON Web
      </p>
      <p class="subtitle">
        Info subtitle
      </p>
    </div>
  </section>

  <div class="columns">
    <div class="column is-2" >
      <div class="box">
        <aside class="menu">
          <p class="menu-label">
            General
          </p>
          <ul class="menu-list">
            <li><a>Dashboard</a></li>
            <li><a>Server Management</a></li>
            <li><a>Settings</a></li>
          </ul>
          <p class="menu-label">
            Servers
          </p>
          <ul class="menu-list">
            <li><a>Server 1</a></li>
            <li><a>Server 2</a></li>
            <li><a>Server 3</a></li>
            <li><a>Server 4</a></li>
          </ul>
        </aside>
      </div>
    </div>
    <div class="column">

    </div>
  </div>
</div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
