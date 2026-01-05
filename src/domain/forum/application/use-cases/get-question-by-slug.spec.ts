import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { GetQuestionBySlugUseCase } from "./get-question-by-slug"
import { Slug } from "../../enterprise/entities/value-objects/slug"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe("Get a question by Slug", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })
  it("should get a question by your slug", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.createFromText("New Title"),
    })

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({ slug: "new-title" })

    expect(result.isRight()).toBeTruthy()
    // expect(result.value?.question.id).toEqual(newQuestion.id)
    // expect(result.value?.question.title).toEqual(newQuestion.title)
  })
})
