1.9.0 Alright, there is nothing wrong with the that React.memo solution, but let's look at another one, which will provide us a state normalization and just using normalized data overall which is recommended.
? 1.9.1 Normalized data structure is recommended approach for storing items and normalization means:
* No duplication of data;
* Keeping the items stored in a lookup table by item ID;
* It's recommended in docs.
* 
? 1.9.2 Our normalized state shape comprises an object with an IDs array and then nested entities object, that contains all the items. The best part of using normalized data with Redux Toolkit that Redux Toolkit offers a Create Entity Adapter API, and it can really make slices less complicated and easier to manage:
<script>
const state = {
  ids: [1, 2, 3],
  entities: {
    "1": {
      userId: 1,
      id: 1,
      title: "some title"
    }
  }
}
</script>
Create Entity Adapter API advantages are:
* Abstracts more logic from components;
* Built-in CRUD methods;
* Automatic selector generation.

(Go to [src/features/posts/postsSlice.js])