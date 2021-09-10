import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'mergedSetsApp';
  public set1DefaultValue: string = "a/3,a/4,a/128,a/129,b/65,b/66,c/1,c/10,c/42,a/128";
  public set2DefaultValue: string = "a/1,a/2,a/3,a/4,a/5,a/126,a/127,b/100,c/2,c/3,d/1,d/2";
  public set1 : string;
  public set2: string;
  public mergedSet: string | undefined;
  public submitted: boolean = false;

  constructor() {
    this.set1 = this.set1DefaultValue;
    this.set2 = this.set2DefaultValue;
  }

  public merge(): void {
    let set1: ISetObject = this.parse(this.set1);
    let set2: ISetObject = this.parse(this.set2);

    let uniqueIds = this.internalMergeUniqueIds(set1.uniqueIds, set2.uniqueIds);

    let mergedSetObject: ISetObject = new SetObject();
    for(let id of uniqueIds){
      let s = new Set();
      if (set1.dictionary.get(id) && set2.dictionary.get(id)){
        s = new Set([...set1.dictionary.get(id), ...set2.dictionary.get(id)]);
      }
      else if(set1.dictionary.has(id)){
        s = new Set(set1.dictionary.get(id));
      }
      else if(set2.dictionary.has(id)){
        s = new Set(set2.dictionary.get(id));
      }

      // @ts-ignore
      mergedSetObject[id] = s;
    }
    console.log(mergedSetObject);

    this.prepareMergedSet(mergedSetObject);
    this.submitted = true;
  }

  private parse(input: string): ISetObject{
    let uniq_ids: string[] = [];
    let dictionary = new Map();

    let split2 = input.split(",");

    let elementSplit;
    for (let element of split2) {
      elementSplit = element.split('/');

      if (!uniq_ids.includes(elementSplit[0])) {
        uniq_ids.push(elementSplit[0]);
      }
      if (!dictionary.has(elementSplit[0])) {
        dictionary.set(elementSplit[0], []);
      }
      dictionary.get(elementSplit[0]).push(elementSplit[1])
    }

    let node = new SetObject();
    node.uniqueIds = uniq_ids;
    node.dictionary = dictionary;

    return node;
  }

  private compareLength(string1: string, string2: string): number{
    if( string1.length < string2.length){
      return -1
    }
    else if(string1.length > string2.length){
      return 1;
    }
    return 0;
  }


  private internalMergeUniqueIds(uniqueIds1: string[], uniqueIds2:string[]): string[]{
    let index1 = 0;
    let index2 = 0;
    let result: string[] = [];
    while (index2 < uniqueIds1.length && index1 < uniqueIds2.length){
      if(this.compareLength(uniqueIds1[index2], uniqueIds2[index1]) === -1) {
        result.push(uniqueIds1[index2]);
        index2 += 1;
      }
      else if(this.compareLength(uniqueIds1[index2], uniqueIds2[index1]) === 1){
        result.push(uniqueIds2[index2]);
        index1 += 1;
      }
      else{
        if(!result.includes(uniqueIds1[index2])){
          result.push(uniqueIds1[index2]);
        }
        index2 += 1;
        index1 += 1;
      }

    }

    if(index2< uniqueIds1.length){
      result = result.concat(uniqueIds1.slice(index2));
    }
    if(index1< uniqueIds2.length){
      result = result.concat(uniqueIds2.slice(index1));
    }

    return result;
  }

  private prepareMergedSet(source: ISetObject){
    let result:string = "";
    for(let e of Object.entries(source)){
      // @ts-ignore
      for(let entry of e[1]){
        result = result.concat(e[0]+'/' + entry + ', ');
      }
    }

    this.mergedSet = result;
    console.log(result);
  }

}

interface ISetObject{
  uniqueIds: string[];
  dictionary: any;
}

class SetObject implements ISetObject{
  dictionary: any;
  uniqueIds!: string[];
}
