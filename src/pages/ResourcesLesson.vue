<template>
  <Lesson
    v-if="tutorial"
    :isResources="true"
    :tutorialId="tutorial && tutorial.tutorialId"
    :resources="tutorial && tutorial.resources"
    :project="tutorial.project.id"
  />
</template>

<script>
import head from '../utils/head/index.js'
import { getTutorialByUrl } from '../utils/tutorials.js'
import Lesson from '../components/Lesson.vue'

export default {
  components: {
    Lesson
  },
  props: {
    tutorialUrl: String
  },
  computed: {
    tutorial: function () {
      const tutorial = getTutorialByUrl(this.tutorialUrl)

      // If no tutorial was found, redirect to 404 page
      if (!tutorial) {
        this.$router.replace({ name: '404' })

        return
      }

      return tutorial
    }
  },
  head () {
    console.log('resourcesLesson.vue head')
    return this.tutorial && head.dynamic.resources({ context: this })
  }
}
</script>
