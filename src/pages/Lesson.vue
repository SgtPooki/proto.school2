<template>
    <Lesson
        v-if="!!lesson && (!lesson.meta?.type || lesson.meta?.type === 'text' || lesson.meta?.type === 'code')"
        :text="!!lesson && lesson.html"
        :concepts="concepts"
        :challenge="challenge"
        :validate="logic.validate"
        :code="logic.code"
        :solution="logic.solution"
        :overrideErrors="logic.options.overrideErrors"
        :createTestFile="logic.options.createTestFile"
        :createTestTree="logic.options.createTestTree"
        :lessonId="parseInt(lessonId, 10)"
        :lessonTitle="!!lesson && lesson.meta?.title"
    />
    <FileLesson
        v-else-if="!!lesson && lesson.meta.type === 'file-upload'"
        :text="!!lesson && lesson.html"
        :concepts="concepts"
        :challenge="challenge"
        :validate="logic.validate"
        :code="logic.code"
        :solution="logic.solution"
        :overrideErrors="logic.options.overrideErrors"
        :createTestFile="logic.options.createTestFile"
        :createTestTree="logic.options.createTestTree"
        :lessonId="parseInt(lessonId, 10)"
        :lessonTitle="!!lesson && lesson.meta.title"
    />
    <MultipleChoiceLesson
        v-else-if="!!lesson && lesson.meta.type === 'multiple-choice'"
        :text="!!lesson && lesson.html"
        :concepts="concepts"
        :question="logic.question"
        :choices="logic.choices"
        :overrideErrors="logic.options.overrideErrors"
        :createTestFile="logic.options.createTestFile"
        :createTestTree="logic.options.createTestTree"
        :lessonId="parseInt(lessonId, 10)"
        :lessonTitle="!!lesson && lesson.meta.title"
    />
</template>

<script>
// import { debug } from '../utils/debug'
import head from '../utils/head'
import { getTutorialByUrl } from '../utils/tutorials'
import marked from '../utils/marked'
import Lesson from '../components/Lesson.vue'
import FileLesson from '../components/FileLesson.vue'
import MultipleChoiceLesson from '../components/MultipleChoiceLesson.vue'
import { getTutorialImport } from '../utils/tutorials-helper.js'
import { ref, onMounted } from 'vue'
// const tutorialsImports = import.meta.glob('@/tutorials/[0-9]*/**')

export default {
  components: {
    Lesson,
    FileLesson,
    MultipleChoiceLesson
  },
  props: {
    tutorialUrl: String,
    lessonId: String
  },
  setup: (props) => {
    const tutorial = getTutorialByUrl(props.tutorialUrl)
    const loadedFiles = ref({})

    if (tutorial == null) {
      this.$router.replace({ name: '404' })
    }
    onMounted(async () => {
      const newLoadedFilesValue = {}
      const tutorialPath = `${tutorial.formattedId}-${tutorial.url}/${props.lessonId}`

      try {
        newLoadedFilesValue.md = await getTutorialImport(`${tutorialPath}.md`)
      } catch {}
      try {
        newLoadedFilesValue.concepts = await getTutorialImport(`${tutorialPath}-concepts.md`)
      } catch {}
      try {
        newLoadedFilesValue.challenge = await getTutorialImport(`${tutorialPath}-challenge.md`)
      } catch {}
      try {
        newLoadedFilesValue.js = await getTutorialImport(`${tutorialPath}.js`)
      } catch {}

      loadedFiles.value = newLoadedFilesValue
    })
    return {
      tutorial,
      loadedFiles
    }
  },
  computed: {
    lesson: function () {
      const lesson = this.loadedFiles.md && marked(this.loadedFiles.md)
      return lesson
    },
    lessonNeedsJsFile: function () {
      return this.lesson && !!this.lesson.meta?.type && this.lesson.meta?.type !== 'text'
    },
    lessonNeedsChallengeFile: function () {
      return this.lesson && !!this.lesson.meta?.type && (
        this.lesson.meta?.type === 'code' ||
        this.lesson.meta?.type === 'file-upload'
      )
    },
    concepts: function () {
      const concepts = this.loadedFiles.concepts

      return concepts ? marked(concepts).html : ''
    },
    challenge: function () {
      const challenge = this.lessonNeedsChallengeFile && this.loadedFiles.challenge

      return challenge ? marked(challenge).html : ''
    },
    logic: function () {
      let logic = {
        options: {
          overrideErrors: false,
          createTestFile: false,
          createTestTree: false
        }
      }


      if (!this.tutorial || !this.lesson || !this.lessonNeedsJsFile) {
        return logic
      }

      if (!this.loadedFiles.js) {
        console.error(`No JavaScript file found '${this.tutorial.formattedId}-${this.tutorial.url}/${this.lessonId}'. Please create a JavaScript file for this lesson.`)
        return logic
      }

      let fileLogic = this.loadedFiles.js
      logic = {
        ...logic,
        ...fileLogic,
        options: {
          ...logic.options,
          ...fileLogic.options
        }
      }

      if (this.lesson.meta.type === 'code') {
        if (!logic.validate) {
          console.warn(`No "validate" function found. Please export a "validate" function from the JavaScript file.`)
        }

        if (!logic.code) {
          console.warn(`No "code" String found. Please export a "code" String from the JavaScript file.`)
        }

        if (!logic.solution) {
          console.warn(`No "solution" String found. Please export a "solution" String from the JavaScript file.`)
        }
      }

      return logic
    }
  },
  head () {
    return this.tutorial && this.lesson && head.dynamic.lessons({ context: this })
  }
}
</script>
