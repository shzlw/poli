package com.shzlw.poli.rest;

import com.shzlw.poli.dao.BoardDao;
import com.shzlw.poli.dao.FilterDao;
import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.model.Board;
import com.shzlw.poli.model.Filter;
import com.shzlw.poli.model.JdbcDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ws/board")
public class BoardWs {

    @Autowired
    BoardDao boardDao;

    @Autowired
    FilterDao filterDao;

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public List<Board> all() {
        return boardDao.fetchAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public Board one(@PathVariable("id") long id) {
        Board board = boardDao.fetchById(id);
        List<Filter> filters = filterDao.fetchAllByBoardId(id);
        board.setFilters(filters);
        return board;
    }

    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<Long> add(@RequestBody Board board) {
        long id = boardDao.add(board);
        return new ResponseEntity<Long>(id, HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @Transactional
    public ResponseEntity<?> update(@RequestBody Board board) {
        // TODO:
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        boardDao.delete(id);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
}
