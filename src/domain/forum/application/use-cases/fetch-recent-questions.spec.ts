import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"

import { makeQuestion } from "../../../../../test/factories/make-question"
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions"
import { InMemoryQuestionAttachmentsRepository } from "../../../../../test/repositories/in-memory-question-attachments-repository"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe("Find many recent questions with pagination", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })
  it("should return recent questions in order", async () => {
    const newQuestion = makeQuestion({
      createdAt: new Date(2025, 12, 20),
    })
    const newQuestion2 = makeQuestion({ createdAt: new Date(2025, 12, 22) })

    inMemoryQuestionsRepository.create(newQuestion)
    inMemoryQuestionsRepository.create(newQuestion2)

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toBeTruthy()

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: newQuestion2.createdAt }),
      expect.objectContaining({ createdAt: newQuestion.createdAt }),
    ])
  })

  it("should return recent questions with pagination", async () => {
    for (let i = 1; i <= 22; i++) {
      const newQuestion = makeQuestion()

      inMemoryQuestionsRepository.create(newQuestion)
    }

    const result = await sut.execute({ page: 2 })

    expect(result.value?.questions).toHaveLength(2)
  })
})
