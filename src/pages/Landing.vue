<template>
  <div>
    <Header />
    <Tutorial :tutorial="tutorial" isLanding :tutorialId="tutorial.formattedId"/>
    <Footer/>
  </div>
</template>

<script>
import head from '../utils/head'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import Tutorial from '../components/Tutorial.vue'
import { getTutorialByUrl } from '../utils/tutorials'

export default {
  components: {
    Header,
    Footer,
    Tutorial
  },
  props: {
    tutorialUrl: String
  },
  computed: {
    tutorial: function () {
      const tutorial = getTutorialByUrl(this.tutorialUrl)
      // console.log('tutorialUrl', this.tutorialUrl)

      // If no tutorial was found, redirect to 404 page
      if (!tutorial) {
        console.log('calling this.$router.replace({ name: 404 })')
        this.$router.replace({ name: '404' })

        return null
      }

      return tutorial
    }
  },
  head () {
    return this.tutorial && head.dynamic.tutorials({ context: this })
  }
}
</script>
