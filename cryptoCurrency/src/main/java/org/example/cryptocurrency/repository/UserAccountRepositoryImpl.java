package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.Transaction;
import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.models.UserHoldings;
import org.example.cryptocurrency.repository.contracts.TransactionRepository;
import org.example.cryptocurrency.repository.contracts.UserAccountRepository;
import org.example.cryptocurrency.repository.contracts.UserHoldingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserAccountRepositoryImpl implements UserAccountRepository {
    private final DataSource dataSource;
    private final TransactionRepository transactionRepository;
    private final UserHoldingRepository userHoldingRepository;
    @Autowired
    public UserAccountRepositoryImpl(DataSource dataSource, TransactionRepository transactionRepository,
                                     UserHoldingRepository userHoldingRepository) {
        this.dataSource = dataSource;
        this.transactionRepository = transactionRepository;
        this.userHoldingRepository = userHoldingRepository;
    }
    @Override
    public UserAccount findById(Integer userId) {
        String sql = "SELECT id, username, balance, email, password FROM user_account WHERE id = ?";
        try(Connection connection = dataSource.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sql)){
            preparedStatement.setInt(1, userId);
            try(ResultSet resultSet = preparedStatement.executeQuery()){
                if(resultSet.next()){
                    UserAccount userAccount = new UserAccount();
                    userAccount.setUserId(resultSet.getInt("id"));
                    userAccount.setBalance(resultSet.getBigDecimal("balance"));
                    userAccount.setUsername(resultSet.getString("username"));
                    userAccount.setEmail(resultSet.getString("email"));
                    userAccount.setPassword(resultSet.getString("password"));
                    List<Transaction> transactions = transactionRepository
                            .findByUserIdOrderByTransactionTimeDesc(userAccount.getUserId());
                    userAccount.setTransactions(transactions);
                    List<UserHoldings> holdings = userHoldingRepository.findByUserId(userAccount.getUserId());
                    userAccount.setHoldings(holdings);
                    return userAccount;
                }
            }
        }catch (SQLException sqlException){
            sqlException.printStackTrace();
        }
        return null;
    }

    @Override
    public UserAccount findByUsername(String username) {
        String sql = "SELECT id, username, balance, email, password FROM user_account WHERE username = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            try (ResultSet resultSet = ps.executeQuery()) {
                if (resultSet.next()) {
                    UserAccount userAccount = new UserAccount();
                    userAccount.setUserId(resultSet.getInt("id"));
                    userAccount.setBalance(resultSet.getBigDecimal("balance"));
                    userAccount.setUsername(resultSet.getString("username"));
                    userAccount.setEmail(resultSet.getString("email"));
                    userAccount.setPassword(resultSet.getString("password"));
                    List<Transaction> transactions = transactionRepository
                            .findByUserIdOrderByTransactionTimeDesc(userAccount.getUserId());
                    userAccount.setTransactions(transactions);
                    List<UserHoldings> holdings = userHoldingRepository.findByUserId(userAccount.getUserId());
                    userAccount.setHoldings(holdings);
                    return userAccount;

                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }


    @Override
    public List<UserAccount> findAll() {
        List<UserAccount> result = new ArrayList<>();
        String sql = "SELECT id, username, balance, email, password FROM user_account";
        try (Connection conn = dataSource.getConnection();
             Statement statement = conn.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                UserAccount userAccount = new UserAccount();
                userAccount.setUserId(resultSet.getInt("id"));
                userAccount.setBalance(resultSet.getBigDecimal("balance"));
                userAccount.setUsername(resultSet.getString("username"));
                userAccount.setEmail(resultSet.getString("email"));
                userAccount.setPassword(resultSet.getString("password"));
                List<Transaction> transactions = transactionRepository
                        .findByUserIdOrderByTransactionTimeDesc(userAccount.getUserId());
                userAccount.setTransactions(transactions);
                List<UserHoldings> holdings = userHoldingRepository.findByUserId(userAccount.getUserId());
                userAccount.setHoldings(holdings);

                result.add(userAccount);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public UserAccount save(UserAccount user) {
        if (user.getUserId() == null) {
            String insertSql = "INSERT INTO user_account (balance, username, email, password) VALUES (?, ?, ?, ?)";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setBigDecimal(1, user.getBalance());
                ps.setString(2, user.getUsername());
                ps.setString(3, user.getEmail());
                ps.setString(4, user.getPassword());
                ps.executeUpdate();
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        user.setUserId(keys.getInt(1));
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            String updateSql = "UPDATE user_account SET balance = ? WHERE id = ?";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(updateSql)) {
                ps.setBigDecimal(1, user.getBalance());
                ps.setInt(2, user.getUserId());
                ps.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return user;
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM user_account WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
