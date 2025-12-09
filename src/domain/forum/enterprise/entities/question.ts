import { Slug } from "./value-objects/slug"
import { Entity } from "../../../../core/entities/entity"
import type { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import type { Optional } from "../../../../core/types/optional"
import { Dayjs } from "dayjs"

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updateAt?: Date
}

export class Question extends Entity<QuestionProps> {
  get content() {
    return this.props.content
  }
  get authorId() {
    return this.props.authorId
  }
  get bestAnswerId() {
    return this.props.bestAnswerId
  }
  get title() {
    return this.props.title
  }
  get slug() {
    return this.props.slug
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updateAt() {
    return this.props.updateAt
  }

  get isNew() {
    return new Dayjs().diff(this.createdAt, "days") <= 3
  }

  get excerpt() {
    return this.props.content.substring(0, 120).trimEnd().concat("...")
  }

  private touch() {
    this.props.updateAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if (bestAnswerId === undefined) {
      return
    }
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  static create(
    props: Optional<QuestionProps, "createdAt" | "slug">,
    id?: UniqueEntityId
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return question
  }
}

///
// 7/11/2025
// Muita gratidão...
// Dia de ontem foi repleto de interações, das quais nitidamente iniciei
// levemente desconfortavel, curioso saber como tudo passa pela respiração
// pela presença no momento, no prestar atenção as pessoas, à conversa
// autoaceitação, autocompaixão e ser gentil com as pessoas.
// ser interessado, ser leve, positivo. troque as zoeiras que possam ser ácidas
// por aquelas leves, positivas.
// cada vez mais procurar enaltecer as pessoas e dizer o que vc sente.
// saber o que eu quero, onde quero chegar e agir com confiança.
// Deus é maravilhoso, muita gratidão. Me diverti, me conectei, me expressei.
// Perdão, amor, gratidão... cada vez mais fechado com a verdade e com disposição
// pra encarar os novos amanhecer com entusiasmo, disposição e positividade.
// pelo simples fato de ser uma nova oportunidade de viver, respirar novos ares
// me desafiar e confrontar meus demonios, meus medos e inseguranças.
///
