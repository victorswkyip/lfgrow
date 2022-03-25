import { Injectable } from '@angular/core';
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApolloClientService {

  constructor() { }
}

const APIURL = environment.LENS_API;

export const apolloClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})