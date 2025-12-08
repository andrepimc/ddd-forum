import { expect, describe, beforeEach, it } from "vitest";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe("create a Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })
  it('should create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteúdo da minha pergunta',
    })

    expect(question.title).toEqual('Nova pergunta')
    expect(inMemoryQuestionsRepository.items[0]?.id).toEqual(question.id)
  })
})
