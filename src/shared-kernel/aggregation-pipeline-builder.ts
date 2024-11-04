import { FilterQuery, PipelineStage, QuerySelector, Types } from "mongoose";
import { injectable } from "tsyringe";

@injectable()
export class AggregationPipelineBuilder<T> {
  #_pipeline: PipelineStage[] = [];

  addMatchStage(field: string, filter: QuerySelector<T> | unknown) {
    const stage: PipelineStage.Match = { $match: { [field]: filter } };

    this.#_pipeline.push(stage);

    return this;
  }

  addStringMatchStage(field: string, toMatch: string) {
    const stage: PipelineStage.Match = {
      $match: {
        [field]: new RegExp(toMatch, "i")
      }
    };

    this.#_pipeline.push(stage);

    return this;
  }

  addArrayMatchStage(field: string, filterArray: Array<unknown>, inOperation = true) {
    const operator = inOperation ? "$in" : "$nin";

    const stage: PipelineStage.Match = {
      $match: {
        [field]: {
          [operator]: filterArray
        }
      }
    };

    this.#_pipeline.push(stage);

    return this;
  }

  addObjectIdMatchStage(field: string, id: string) {
    const stage: PipelineStage.Match = {
      $match: {
        [field]: new Types.ObjectId(id)
      }
    };

    this.#_pipeline.push(stage);

    return this;
  }

  addOrOperatorMatchStage(...conditions: FilterQuery<unknown>[]) {
    const stage: PipelineStage.Match = {
      $match: {
        $or: conditions
      }
    };

    this.#_pipeline.push(stage);

    return this;
  }

  addRangeMatchStage(field: string, minValue: number | Date, maxValue: number | Date) {
    const stage: PipelineStage.Match = {
      $match: { [field]: { $gte: minValue, $lte: maxValue } }
    };

    this.#_pipeline.push(stage);

    return this;
  }

  addJoinStage(
    from: string,
    localField: string,
    foreignField: string,
    as: string,
    unwind: boolean = true
  ) {
    const stage: PipelineStage.Lookup = { $lookup: { from, localField, foreignField, as } };

    this.#_pipeline.push(stage);

    if (unwind) {
      this.#_pipeline.push({
        $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: true }
      });
    }

    return this;
  }

  addSkipStage(value: number) {
    const stage: PipelineStage.Skip = { $skip: value };

    this.#_pipeline.push(stage);

    return this;
  }

  addLimitStage(value: number) {
    const stage: PipelineStage.Limit = { $limit: value };

    this.#_pipeline.push(stage);

    return this;
  }

  addSortStage(fields: string | string[], orderByDesc: boolean = true) {
    const stage: PipelineStage.Sort = { $sort: {} };

    if (typeof fields === "string") {
      stage.$sort = { [fields]: orderByDesc ? -1 : 1 };
    } else {
      fields.forEach((f) => {
        stage.$sort[f] = orderByDesc ? -1 : 1;
      });
    }

    this.#_pipeline.push(stage);

    return this;
  }

  addAddFieldStage(field: string, expression: Record<string, unknown>) {
    const stage: PipelineStage.AddFields = { $addFields: { [field]: expression } };

    this.#_pipeline.push(stage);

    return this;
  }

  addProjectionStage(fields: string[], inclusion: boolean = true) {
    const expression: Record<string, number> = {};

    if (typeof fields === "string") {
      fields = [fields];
    }

    fields.forEach((f) => {
      expression[f] = Number(inclusion);
    });

    const stage: PipelineStage.Project = { $project: expression };

    this.#_pipeline.push(stage);

    return this;
  }

  addGroupStage(key: string, aggregatorsExpression: Record<string, unknown>) {
    const stage: PipelineStage.Group = { $group: { _id: key, ...aggregatorsExpression } };

    this.#_pipeline.push(stage);

    return this;
  }

  addUnwindStage(path: string, preserveNullAndEmptyArrays: boolean = true) {
    const stage: PipelineStage.Unwind = {
      $unwind: { path: `$${path}`, preserveNullAndEmptyArrays }
    };

    this.#_pipeline.push(stage);

    return this;
  }

  addSetStage(path: string, expression: Record<string, unknown>) {
    const stage = { $set: { [path]: expression } };

    this.#_pipeline.push(stage);

    return this;
  }

  addSetStageFromObject(obj: Record<string, unknown>) {
    const keys = Object.keys(obj);

    // eslint-disable-next-line guard-for-in
    for (const key in keys) {
      const stage = { $set: { [key]: obj[key] } };

      this.#_pipeline.push(stage);
    }

    // const stage = { $set: { [path]: expression } };

    // this.#_pipeline.push(stage);

    return this;
  }

  addMergeStage(collectionName: string) {
    const stage = {
      $merge: {
        into: collectionName, // Specify the target collection
        whenMatched: "merge" as const, // Merge with existing documents
        whenNotMatched: "discard" as const // Discard if no match
      }
    };

    this.#_pipeline.push(stage);

    return this;
  }

  build() {
    return this.#_pipeline;
  }
}
